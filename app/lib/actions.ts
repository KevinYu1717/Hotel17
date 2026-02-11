'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from './db';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'],{
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
  room_type: z.string().optional(),
  breakfast_included: z.boolean().optional(),
  check_in_date: z.string().optional(),
  check_out_date: z.string().optional(),
  guests_count: z.coerce.number().optional(),
  id_verified: z.boolean().optional(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    room_type?: string[];
    breakfast_included?: string[];
    check_in_date?: string[];
    check_out_date?: string[];
    guests_count?: string[];
    id_verified?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
      room_type: formData.get('room_type'),
      breakfast_included: formData.get('breakfast_included') === 'on',
      check_in_date: formData.get('check_in_date'),
      check_out_date: formData.get('check_out_date'),
      guests_count: formData.get('guests_count'),
      id_verified: formData.get('id_verified') === 'on',
    });
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
    const { customerId, amount, status, room_type, breakfast_included, check_in_date, check_out_date, guests_count, id_verified } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
      db.prepare(`
        INSERT INTO invoices (id, customer_id, amount, status, date, room_type, breakfast_included, check_in_date, check_out_date, guests_count, id_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), customerId, amountInCents, status, date, room_type || null, breakfast_included ? 1 : 0, check_in_date || null, check_out_date || null, guests_count || 1, id_verified ? 1 : 0);
    } catch (error) {
      // We'll also log the error to the console for now
      console.error(error);
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    room_type: formData.get('room_type'),
    breakfast_included: formData.get('breakfast_included') === 'on',
    check_in_date: formData.get('check_in_date'),
    check_out_date: formData.get('check_out_date'),
    guests_count: formData.get('guests_count'),
    id_verified: formData.get('id_verified') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status, room_type, breakfast_included, check_in_date, check_out_date, guests_count, id_verified } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    db.prepare(`
      UPDATE invoices
      SET customer_id = ?, amount = ?, status = ?, room_type = ?, breakfast_included = ?, check_in_date = ?, check_out_date = ?, guests_count = ?, id_verified = ?
      WHERE id = ?
    `).run(customerId, amountInCents, status, room_type || null, breakfast_included ? 1 : 0, check_in_date || null, check_out_date || null, guests_count || 1, id_verified ? 1 : 0, id);
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
      db.prepare(`DELETE FROM invoices WHERE id = ?`).run(id);
      revalidatePath('/dashboard/invoices');
    } catch (error) {
      console.error(error);
    }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const parsed = z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

  if (!parsed.success) {
    return 'Invalid input.';
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = db.prepare('SELECT 1 FROM users WHERE email = ? LIMIT 1').get(email);
    if (existing) {
      return 'Email already registered.';
    }

    const hashed = await bcrypt.hash(password, 10);
    db.prepare(`
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `).run(crypto.randomUUID(), name, email, hashed);
  } catch (e) {
    console.error(e);
    return 'Failed to create account.';
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Account created, but sign in failed.';
    }
    throw error;
  }
}
