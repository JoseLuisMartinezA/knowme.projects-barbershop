
'use client'

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css'; // Basic styles, override with tailwind later
import { bookAppointment } from '@/app/actions'; // Need to implement this action!

export default function BookPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleDateSelect = async (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setAvailableSlots([]);

        if (date) {
            setLoadingSlots(true);
            try {
                const res = await fetch(`/api/availability?date=${format(date, 'yyyy-MM-dd')}`);
                if (res.ok) {
                    const data = await res.json();
                    setAvailableSlots(data.slots || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSlots(false);
            }
        }
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) return;

        // Call server action? Or use form?
        // Using a form allows useActionState if needed, but here we have complex state.
        // Let's use a hidden form or manual fetch to API endpoint if easier, 
        // but Server Action is cleaner for auth context.
        // I made bookAppointment action (not yet, but will).

        // Actually, let's wrap this in a form that submits the data.
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">Reservar Cita</h1>

            <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={es}
                    disabled={{ before: new Date() }} // Disable past dates
                    modifiersClassNames={{
                        selected: 'bg-black text-white hover:bg-gray-800',
                        today: 'font-bold text-blue-500'
                    }}
                    className="mx-auto"
                />
            </div>

            {selectedDate && (
                <div className="w-full max-w-md mt-6">
                    <h2 className="text-lg font-semibold mb-3">
                        Horarios para {format(selectedDate, 'PPP', { locale: es })}
                    </h2>

                    {loadingSlots ? (
                        <div className="text-center py-4">Cargando horarios...</div>
                    ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors
                    ${selectedSlot === slot
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-black'}`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">No hay horarios disponibles.</div>
                    )}
                </div>
            )}

            {selectedSlot && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
                    <div className="max-w-md mx-auto flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Reserva para</p>
                            <p className="font-bold">{format(selectedDate!, 'dd/MM/yyyy')} a las {selectedSlot}</p>
                        </div>

                        <form action={bookAppointment}>
                            <input type="hidden" name="date" value={format(selectedDate!, 'yyyy-MM-dd')} />
                            <input type="hidden" name="time" value={selectedSlot} />
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800"
                            >
                                Confirmar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
