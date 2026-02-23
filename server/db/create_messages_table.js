import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import poolWrapper from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMessagesTable() {
  let connection;
  try {
    const sqlPath = path.join(__dirname, 'create_messages_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Connecting to database...');
    connection = await poolWrapper.getConnection();
    
    console.log('Creating messages table...');
    // Use raw connection query for DDL
    await connection.query(sql);

    console.log('✅ Messages table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating messages table:', error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    // End the pool to allow script to exit cleanly
    // poolWrapper exposes end() but it might be async
    // poolWrapper.end() calls pool.end()
    // However, if we exit process, it should be fine.
  }
}

createMessagesTable();