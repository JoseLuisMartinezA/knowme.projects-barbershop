
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
    try {
        console.log('Adding created_at column to appointments...');
        await db.execute('ALTER TABLE appointments ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
        console.log('Migration successful!');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column already exists.');
        } else {
            console.error('Error during migration:', err);
        }
    }
}

migrate();
