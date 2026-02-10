
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h1>
                <p className="text-gray-600 mb-6">
                    Hemos recibido tu solicitud de reserva temporalmente.
                </p>
                <p className="text-sm text-gray-500 mb-8 bg-gray-100 p-3 rounded-lg">
                    Por favor, revisa tu correo electrónico para <strong>confirmar tu cita</strong>. Sin la confirmación, la reserva no será válida.
                </p>

                <Link
                    href="/dashboard"
                    className="w-full bg-black text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
                >
                    Ir a mis citas
                </Link>
            </div>
        </div>
    );
}
