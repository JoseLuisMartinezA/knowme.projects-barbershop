
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email, // Note: In testing mode with onboarding domain, this must be the account email
            subject: 'Verifica tu cuenta - Pablo BarberShop',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Bienvenido a Pablo BarberShop</h1>
          <p>Para activar tu cuenta y reservar citas, por favor verifica tu email haciendo clic aquí:</p>
          <a href="${confirmLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verificar Email</a>
          <p>Si no has solicitado esto, ignora este mensaje.</p>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error sending email:', err);
        return { success: false, error: err };
    }
}

export async function sendBookingConfirmationEmail(email: string, bookingDetails: any, token: string) {
    // Similar logic for booking confirmation
    // Link to /api/bookings/confirm?token=...
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/confirm?token=${token}`;

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Confirma tu cita - Pablo BarberShop',
            html: `
                <div style="font-family: sans-serif;">
                    <h1>Confirma tu Reserva</h1>
                    <p>Has solicitado una cita para el ${new Date(bookingDetails.start_time).toLocaleString()}.</p>
                    <p>Para confirmar, haz clic abajo:</p>
                    <a href="${confirmLink}" style="background: #000; color: #fff; padding: 10px 20px;">Confirmar Cita</a>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
