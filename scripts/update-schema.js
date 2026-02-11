
const db = require('better-sqlite3')('data.db');

try {
  console.log('Adding columns to invoices table...');
  
  // Check if columns exist before adding to avoid errors (simplified check by just trying)
  try {
    db.prepare('ALTER TABLE invoices ADD COLUMN room_type TEXT').run();
    console.log('Added room_type');
  } catch (e) { console.log('room_type might already exist'); }

  try {
    db.prepare('ALTER TABLE invoices ADD COLUMN breakfast_included INTEGER DEFAULT 0').run(); // 0 for false, 1 for true
    console.log('Added breakfast_included');
  } catch (e) { console.log('breakfast_included might already exist'); }

  try {
    db.prepare('ALTER TABLE invoices ADD COLUMN check_in_date TEXT').run();
    console.log('Added check_in_date');
  } catch (e) { console.log('check_in_date might already exist'); }

  try {
    db.prepare('ALTER TABLE invoices ADD COLUMN check_out_date TEXT').run();
    console.log('Added check_out_date');
  } catch (e) { console.log('check_out_date might already exist'); }

  try {
    db.prepare('ALTER TABLE invoices ADD COLUMN guests_count INTEGER DEFAULT 1').run();
    console.log('Added guests_count');
  } catch (e) { console.log('guests_count might already exist'); }
  
  try {
    db.prepare('ALTER TABLE invoices ADD COLUMN id_verified INTEGER DEFAULT 0').run();
    console.log('Added id_verified');
  } catch (e) { console.log('id_verified might already exist'); }

  console.log('Schema update complete.');
} catch (error) {
  console.error('Error updating schema:', error);
}
