const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'app', 'db', 'app.db');
const db = new sqlite3.Database(dbPath);

// Add detailed ID verification fields to invoices table
db.serialize(() => {
  // Add new columns for detailed ID verification
  db.run(`ALTER TABLE invoices ADD COLUMN id_document_type TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding id_document_type:', err);
    } else {
      console.log('Added id_document_type column');
    }
  });

  db.run(`ALTER TABLE invoices ADD COLUMN id_number TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding id_number:', err);
    } else {
      console.log('Added id_number column');
    }
  });

  db.run(`ALTER TABLE invoices ADD COLUMN id_expiration_date TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding id_expiration_date:', err);
    } else {
      console.log('Added id_expiration_date column');
    }
  });

  db.run(`ALTER TABLE invoices ADD COLUMN id_issuing_country TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding id_issuing_country:', err);
    } else {
      console.log('Added id_issuing_country column');
    }
  });

  db.run(`ALTER TABLE invoices ADD COLUMN id_issuing_authority TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding id_issuing_authority:', err);
    } else {
      console.log('Added id_issuing_authority column');
    }
  });

  console.log('Database schema updated successfully with detailed ID verification fields');
});

db.close();