
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const EMAIL_STYLE = `
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    color: #111111;
    background-color: #fafafa;
    padding: 60px 20px;
`;

const CARD_STYLE = `
    max-width: 520px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const HEADER_STYLE = `
    background: #000000;
    padding: 48px 32px;
    text-align: center;
`;

const CONTENT_STYLE = `
    padding: 48px 40px;
`;

const BUTTON_STYLE = `
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 32px;
    padding: 20px;
    background: #000000;
    color: #ffffff;
    text-align: center;
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 11px;
    border-radius: 20px;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
`;

const SECONDARY_BUTTON_STYLE = `
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 12px;
    padding: 20px;
    background: #fdf2f2;
    color: #dc2626;
    text-align: center;
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 11px;
    border-radius: 20px;
`;

const INFO_BOX_STYLE = `
    background: #f9f9f9;
    padding: 28px;
    border-radius: 28px;
    border: 1px solid #f0f0f0;
    margin-top: 32px;
`;

const LABEL_STYLE = `
    font-size: 10px;
    font-weight: 900;
    color: #a0a0a0;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 6px;
`;

const VALUE_STYLE = `
    font-size: 16px;
    font-weight: 800;
    color: #111111;
    margin-bottom: 20px;
`;

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

    try {
        await transporter.sendMail({
            from: `"José Luis - Peluquería Pablo" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'ACTIVA TU CUENTA - José Luis Peluquería Pablo',
            html: `
                <div style="${EMAIL_STYLE}">
                    <div style="${CARD_STYLE}">
                        <div style="${HEADER_STYLE}">
                            <div style="color: #C5A059; font-size: 10px; font-weight: 900; letter-spacing: 0.4em; margin-bottom: 12px; text-transform: uppercase;">BIENVENIDO A</div>
                            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; font-style: italic;">JOSÉ LUIS <span style="color: #C5A059;">BARBER</span></h1>
                        </div>
                        <div style="${CONTENT_STYLE}">
                            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; font-style: italic;">¡Hola!</h2>
                            <p style="margin: 0; color: #666666; font-size: 15px; leading-height: 1.6;">Estamos encantados de tenerte con nosotros. Para empezar a reservar tus citas con facilidad, solo necesitas confirmar tu dirección de correo electrónico.</p>
                            <a href="${confirmLink}" style="${BUTTON_STYLE}">CONFIRMAR EMAIL</a>
                        </div>
                    </div>
                </div>
            `,
        });
        return { success: true };
    } catch (err) {
        console.error('Error sending email:', err);
        return { success: false, error: err };
    }
}

export async function sendBookingConfirmationEmail(email: string, bookingDetails: any, token: string) {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/confirm?token=${token}`;
    const cancelLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/cancel?token=${token}`;
    const date = new Date(bookingDetails.start_time);

    try {
        await transporter.sendMail({
            from: `"José Luis - Peluquería Pablo" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'CONFIRMA TU CITA - José Luis Peluquería Pablo',
            html: `
                <div style="${EMAIL_STYLE}">
                    <div style="${CARD_STYLE}">
                        <div style="${HEADER_STYLE}">
                            <div style="color: #C5A059; font-size: 10px; font-weight: 900; letter-spacing: 0.4em; margin-bottom: 12px; text-transform: uppercase;">RESERVA PENDIENTE</div>
                            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; font-style: italic;">JOSÉ LUIS <span style="color: #C5A059;">BARBER</span></h1>
                        </div>
                        <div style="${CONTENT_STYLE}">
                            <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; font-style: italic;">¡Casi listo!</h2>
                            <p style="margin: 0; color: #666666; font-size: 15px;">Has solicitado una cita. Por favor, <strong>confírmala</strong> pulsando el botón de abajo para que el barbero la reciba.</p>
                            
                            <div style="${INFO_BOX_STYLE}">
                                <div style="${LABEL_STYLE}">FECHA Y HORA</div>
                                <div style="${VALUE_STYLE}">
                                    ${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
                                    <br/>
                                    <span style="color: #C5A059;">${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}hs</span>
                                </div>

                                <div style="${LABEL_STYLE}">SERVICIOS</div>
                                <div style="font-size: 14px; font-weight: 700; color: #111111; margin-bottom: 20px;">
                                    ["${bookingDetails.services}"]
                                </div>

                                <div style="${LABEL_STYLE}">BARBERO</div>
                                <div style="font-size: 14px; font-weight: 700; color: #111111; margin: 0;">
                                    ${bookingDetails.staffName || 'ASIGNACIÓN AUTOMÁTICA'}
                                </div>
                            </div>

                            <a href="${confirmLink}" style="${BUTTON_STYLE}">CONFIRMAR CITA</a>
                            <a href="${cancelLink}" style="${SECONDARY_BUTTON_STYLE}">CANCELAR SOLICITUD</a>
                        </div>
                    </div>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending booking email:', error);
        return { success: false, error };
    }
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/forgot-password/reset?token=${token}`;

    try {
        await transporter.sendMail({
            from: `"José Luis - Peluquería Pablo" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'RECUPERAR CONTRASEÑA - José Luis Peluquería Pablo',
            html: `
                <div style="${EMAIL_STYLE}">
                    <div style="${CARD_STYLE}">
                        <div style="${HEADER_STYLE}">
                            <div style="color: #ef4444; font-size: 10px; font-weight: 900; letter-spacing: 0.4em; margin-bottom: 12px; text-transform: uppercase;">SEGURIDAD</div>
                            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; font-style: italic;">JOSÉ LUIS <span style="color: #C5A059;">BARBER</span></h1>
                        </div>
                        <div style="${CONTENT_STYLE}">
                            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; font-style: italic;">¿Olvidaste tu contraseña?</h2>
                            <p style="margin: 0; color: #666666; font-size: 15px;">Pulsa el botón de abajo para elegir una nueva contraseña. El enlace caduca en 1 hora.</p>
                            <a href="${resetLink}" style="${BUTTON_STYLE}">RESTABLECER CONTRASEÑA</a>
                            <p style="margin: 32px 0 0 0; color: #a0a0a0; font-size: 11px; text-align: center; font-weight: 600;">Si no has solicitado esto, puedes ignorar este correo.</p>
                        </div>
                    </div>
                </div>
            `,
        });
        return { success: true };
    } catch (err) {
        console.error('Error sending reset email:', err);
        return { success: false, error: err };
    }
}

