
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ADMIN_EMAILS = ['peluqueriapablo.contact@gmail.com', 'admin@example.com'];

export default async function AdminPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');

    const payload = await verifyToken(session.value);
    if (!payload || !ADMIN_EMAILS.includes(payload.email as string)) {
        // Not admin
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
            </div>
        );
    }

    // Fetch all appointments
    const result = await db.execute(`
    SELECT a.*, u.email as user_email 
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY start_time DESC
  `);

    const appointments = result.rows;

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Panel de Administración</h1>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase">Cliente</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase">Fecha</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase">Hora</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase">Estado</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase">Token</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {appointments.map((appt: any) => (
                                <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{appt.user_email}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {format(new Date(appt.start_time), 'PP', { locale: es })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {format(new Date(appt.start_time), 'HH:mm')} - {format(new Date(appt.end_time), 'HH:mm')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono truncate max-w-[100px]">
                                        {appt.confirmation_token || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
