
import { db } from '@/lib/db';
import { createEvent } from '@/lib/google';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return new Response('Invalid token', { status: 400 });
    }

    // Find appointment
    const result = await db.execute({
        sql: `
      SELECT a.*, u.email 
      FROM appointments a 
      JOIN users u ON a.user_id = u.id 
      WHERE a.confirmation_token = ?
    `,
        args: [token],
    });

    if (result.rows.length === 0) {
        return new Response('Token invalid or expired', { status: 400 });
    }

    const appointment = result.rows[0];

    if (appointment.status === 'confirmed') {
        return redirect('/dashboard?already_confirmed=true');
    }

    // Create Google Calendar Event
    try {
        const event = await createEvent({
            summary: `Cita con ${appointment.email}`,
            description: `Cita reservada desde la web. Cliente: ${appointment.email}`,
            start: {
                dateTime: appointment.start_time, // stored as ISO string?
                timeZone: 'Europe/Madrid',
            },
            end: {
                dateTime: appointment.end_time,
                timeZone: 'Europe/Madrid',
            },
        });

        // Update DB
        await db.execute({
            sql: 'UPDATE appointments SET status = ?, google_event_id = ?, confirmation_token = NULL WHERE id = ?',
            args: ['confirmed', event.id || null, appointment.id]
        });

    } catch (error) {
        console.error('Error confirming booking:', error);
        return new Response('Failed to confirm booking with provider', { status: 500 });
    }

    return redirect('/dashboard?confirmed=true');
}
