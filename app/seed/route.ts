import bcrypt from 'bcrypt';
import { db } from '@/app/lib/db';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import crypto from 'crypto';

export async function GET() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        image_url TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS revenue (
        month TEXT NOT NULL UNIQUE,
        revenue INTEGER NOT NULL
      );
    `);

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `);

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      insertUser.run(user.id, user.name, user.email, hashedPassword);
    }

    const insertCustomer = db.prepare(`
      INSERT OR IGNORE INTO customers (id, name, email, image_url)
      VALUES (?, ?, ?, ?)
    `);

    for (const customer of customers) {
      insertCustomer.run(customer.id, customer.name, customer.email, customer.image_url);
    }

    const insertInvoice = db.prepare(`
      INSERT INTO invoices (id, customer_id, amount, status, date)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Only insert invoices if the table is empty to avoid duplicates on re-seed
    const invoiceCount = db.prepare('SELECT count(*) as count FROM invoices').get() as { count: number };
    if (invoiceCount.count === 0) {
      for (const invoice of invoices) {
         insertInvoice.run(crypto.randomUUID(), invoice.customer_id, invoice.amount, invoice.status, invoice.date);
      }
    }

    const insertRevenue = db.prepare(`
      INSERT OR IGNORE INTO revenue (month, revenue)
      VALUES (?, ?)
    `);

    for (const rev of revenue) {
      insertRevenue.run(rev.month, rev.revenue);
    }

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
