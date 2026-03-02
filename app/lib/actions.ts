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
  id_document_type: z.string().optional(),
  id_number: z.string().optional(),
  id_expiration_date: z.string().optional(),
  id_issuing_country: z.string().optional(),
  id_issuing_authority: z.string().optional(),
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
    id_document_type?: string[];
    id_number?: string[];
    id_expiration_date?: string[];
    id_issuing_country?: string[];
    id_issuing_authority?: string[];
  };
  message?: string | null;
};

export async function createInvoice(_prevState: State, formData: FormData) {
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
      id_document_type: formData.get('id_document_type'),
      id_number: formData.get('id_number'),
      id_expiration_date: formData.get('id_expiration_date'),
      id_issuing_country: formData.get('id_issuing_country'),
      id_issuing_authority: formData.get('id_issuing_authority'),
    });
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
    const { customerId, amount, status, room_type, breakfast_included, check_in_date, check_out_date, guests_count, id_verified, id_document_type, id_number, id_expiration_date, id_issuing_country, id_issuing_authority } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
      db.prepare(`
        INSERT INTO invoices (id, customer_id, amount, status, date, room_type, breakfast_included, check_in_date, check_out_date, guests_count, id_verified, id_document_type, id_number, id_expiration_date, id_issuing_country, id_issuing_authority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), customerId, amountInCents, status, date, room_type || null, breakfast_included ? 1 : 0, check_in_date || null, check_out_date || null, guests_count || 1, id_verified ? 1 : 0, id_document_type || null, id_number || null, id_expiration_date || null, id_issuing_country || null, id_issuing_authority || null);
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
  _prevState: State,
  formData: FormData,
) {
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
    id_document_type: formData.get('id_document_type'),
    id_number: formData.get('id_number'),
    id_expiration_date: formData.get('id_expiration_date'),
    id_issuing_country: formData.get('id_issuing_country'),
    id_issuing_authority: formData.get('id_issuing_authority'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status, room_type, breakfast_included, check_in_date, check_out_date, guests_count, id_verified, id_document_type, id_number, id_expiration_date, id_issuing_country, id_issuing_authority } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    db.prepare(`
      UPDATE invoices
      SET customer_id = ?, amount = ?, status = ?, room_type = ?, breakfast_included = ?, check_in_date = ?, check_out_date = ?, guests_count = ?, id_verified = ?, id_document_type = ?, id_number = ?, id_expiration_date = ?, id_issuing_country = ?, id_issuing_authority = ?
      WHERE id = ?
    `).run(customerId, amountInCents, status, room_type || null, breakfast_included ? 1 : 0, check_in_date || null, check_out_date || null, guests_count || 1, id_verified ? 1 : 0, id_document_type || null, id_number || null, id_expiration_date || null, id_issuing_country || null, id_issuing_authority || null, id);
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
    console.error('Database Error:', error);
  }
}

export async function authenticate(
  _prevState: string | undefined,
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

const CreateCustomer = z.object({
  name: z.string().min(1, { message: 'Please enter a name.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  image_url: z.string().optional(),
});

export async function createCustomer(
  _prevState: State | undefined,
  formData: FormData,
) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    // Check if customer already exists
    const existing = db.prepare('SELECT 1 FROM customers WHERE email = ? LIMIT 1').get(email);
    if (existing) {
      return {
        message: 'Customer with this email already exists.',
      };
    }

    db.prepare(`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (?, ?, ?, ?)
    `).run(crypto.randomUUID(), name, email, image_url || '/customers/evil-rabbit.png');
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  return { message: 'Customer created successfully.' };
}
