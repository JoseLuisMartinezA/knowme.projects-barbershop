
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { logout } from '@/app/actions';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const confirmed = searchParams.confirmed === 'true';

    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');

    const payload = await verifyToken(session.value);
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        redirect('/login');
    }

    const userId = payload.userId as number;

    // Fetch appointments
    // Using direct SQL
    const result = await db.execute({
        sql: 'SELECT * FROM appointments WHERE user_id = ? ORDER BY start_time ASC',
        args: [userId],
    });

    const appointments = result.rows;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
                    <div className="flex gap-4 items-center">
                        <form action={logout}>
                            <button type="submit" className="text-gray-500 hover:text-black font-medium">
                                Cerrar Sesión
                            </button>
                        </form>
                        <Link href="/book" className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                            + Nueva Cita
                        </Link>
                    </div>
                </header>

                {confirmed && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">¡Cita Confirmada! </strong>
                        <span className="block sm:inline">Tu cita ha sido confirmada y sincronizada.</span>
                    </div>
                )}

                <div className="grid gap-6">
                    {appointments.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                            <p className="text-gray-500 text-lg mb-6">No tienes citas programadas.</p>
                            <a href="/book" className="inline-block border-2 border-black text-black px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                                Agendar mi primera cita
                            </a>
                        </div>
                    ) : (
                        appointments.map((appt: any) => {
                            const start = new Date(appt.start_time);
                            const statusColors = {
                                confirmed: 'bg-green-100 text-green-700 border-green-200',
                                pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                                cancelled: 'bg-red-100 text-red-700 border-red-200'
                            };
                            const statusLabel = {
                                confirmed: 'Confirmada',
                                pending: 'Pendiente',
                                cancelled: 'Cancelada'
                            };

                            return (
                                <div key={appt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            {format(start, 'MMMM', { locale: es })}
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {format(start, 'EEEE d', { locale: es })}
                                        </div>
                                        <div className="text-lg text-gray-600">
                                            {format(start, 'HH:mm')} - {format(new Date(appt.end_time), 'HH:mm')}
                                        </div>
                                    </div>

                                    <div className={`px-4 py-2 rounded-full text-sm font-bold border ${statusColors[appt.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
                                        {statusLabel[appt.status as keyof typeof statusLabel] || appt.status}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
