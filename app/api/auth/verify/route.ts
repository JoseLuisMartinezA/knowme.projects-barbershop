
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return new Response('Invalid token', { status: 400 });
    }

    // Find user by token
    const result = await db.execute({
        sql: 'SELECT id FROM users WHERE verification_token = ?',
        args: [token],
    });

    if (result.rows.length === 0) {
        return new Response('Invalid or expired token', { status: 400 });
    }

    const userId = result.rows[0].id;

    // Verify user
    await db.execute({
        sql: 'UPDATE users SET email_verified = 1, verification_token = NULL WHERE id = ?',
        args: [userId],
    });

    return redirect('/login?verified=true');
}
