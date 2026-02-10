
'use server'

import { db } from '@/lib/db'
import { hashPassword, comparePassword, signToken, generateVerificationToken, verifyToken } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

export async function register(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Check existing user
    const result = await db.execute({
        sql: 'SELECT id, email_verified FROM users WHERE email = ?',
        args: [email]
    })

    if (result.rows.length > 0) {
        const existingUser = result.rows[0];
        if (existingUser.email_verified) {
            return { error: 'El usuario ya existe' };
        }
        // If exists but not verified, delete it so we can re-register clean
        await db.execute({
            sql: 'DELETE FROM users WHERE id = ?',
            args: [existingUser.id]
        });
    }

    const hashedPassword = await hashPassword(password)
    const verificationToken = generateVerificationToken()

    let newUserId: any;

    try {
        const insertResult = await db.execute({
            sql: 'INSERT INTO users (email, password_hash, verification_token) VALUES (?, ?, ?) RETURNING id',
            args: [email, hashedPassword, verificationToken]
        })
        newUserId = insertResult.rows[0].id;

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken);

        if (!emailResult.success) {
            // Rollback user creation
            await db.execute({
                sql: 'DELETE FROM users WHERE id = ?',
                args: [newUserId]
            });

            // Extract error message
            const errorMessage = emailResult.error && typeof emailResult.error === 'object' && 'message' in emailResult.error
                ? (emailResult.error as any).message
                : 'Error al enviar email de verificación';

            return { error: errorMessage };
        }

        return { success: true, message: 'Revisa tu email (incluso SPAM) para verificar la cuenta.' }
    } catch (error) {
        console.error('Registration error:', error)
        return { error: 'Error al crear la cuenta' }
    }
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
    })

    const user = result.rows[0]

    if (!user || !await comparePassword(password, user.password_hash as string)) {
        return { error: 'Invalid credentials' }
    }

    if (!user.email_verified) {
        return { error: 'Please verify your email first' }
    }

    // Create session
    const token = await signToken({ userId: user.id, email: user.email })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
    })

    redirect('/dashboard')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/login')
}

// Add new imports needed for bookAppointment
import { sendBookingConfirmationEmail } from '@/lib/email'
import { parse, setHours, setMinutes } from 'date-fns'

export async function bookAppointment(formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');

    const payload = await verifyToken(session.value);
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        redirect('/login');
    }

    const userId = payload.userId as number; // Assuming ID is number
    const email = payload.email as string;

    const dateStr = formData.get('date') as string;
    const timeStr = formData.get('time') as string;

    if (!dateStr || !timeStr) {
        throw new Error('Missing data');
    }

    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    const [hours, minutes] = timeStr.split(':').map(Number);
    const startTime = setMinutes(setHours(date, hours), minutes);
    const endTime = setMinutes(setHours(date, hours), minutes + 30);

    const confirmationToken = generateVerificationToken();

    try {
        await db.execute({
            sql: 'INSERT INTO appointments (user_id, start_time, end_time, status, confirmation_token) VALUES (?, ?, ?, ?, ?)',
            args: [userId, startTime.toISOString(), endTime.toISOString(), 'pending', confirmationToken]
        });

        await sendBookingConfirmationEmail(email, { start_time: startTime }, confirmationToken);

        redirect('/book/success'); // Make sure this page exists!
    } catch (error) {
        console.error('Booking error:', error);
        throw error;
    }
}
