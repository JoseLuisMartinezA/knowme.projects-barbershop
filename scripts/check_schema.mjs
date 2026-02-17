
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
    const r = await db.execute('PRAGMA table_info(appointments)');
    console.log(JSON.stringify(r.rows, null, 2));
}

check();
