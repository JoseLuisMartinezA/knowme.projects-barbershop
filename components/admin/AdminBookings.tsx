'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Scissors, Filter, Mail, Phone, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cancelAppointment } from '@/app/actions'
import PrivacyGuard from './PrivacyGuard'

interface Appointment {
    id: number
    customer_name: string
    customer_email: string
    start_time: string
    end_time: string
    status: string
    services: string
    notes: string
    staff_id: number
    user_name: string | null
    staff_name: string
}

interface Staff {
    id: number
    name: string
}

interface AdminBookingsProps {
    appointments: Appointment[]
    staff: Staff[]
}

export default function AdminBookings({ appointments, staff }: AdminBookingsProps) {
    const [selectedStaff, setSelectedStaff] = useState<string>('all')

    const filteredAppointments = selectedStaff === 'all'
        ? appointments
        : appointments.filter(apt => apt.staff_id === parseInt(selectedStaff))

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-50 text-green-700 border-green-100'
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-100'
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmada'
            case 'pending':
                return 'Pendiente'
            case 'cancelled':
                return 'Cancelada'
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Listado de Citas
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        {filteredAppointments.length} reserva{filteredAppointments.length !== 1 ? 's' : ''} en total
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Barbero:</label>
                    <div className="relative w-full sm:w-64">
                        <select
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all cursor-pointer appearance-none"
                        >
                            <option value="all">TODOS LOS BARBEROS</option>
                            {staff.filter(s => s.name !== 'Cualquiera').map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* List */}
            <PrivacyGuard label="listado completo">
                {filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                            No hay citas para mostrar
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAppointments.map((apt) => {
                            const startDate = new Date(apt.start_time)
                            const endDate = new Date(apt.end_time)
                            const customerName = apt.customer_name || apt.user_name || 'Cliente'

                            return (
                                <div
                                    key={apt.id}
                                    className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 hover:border-gray-300 transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                >
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                        {/* Name & Contact */}
                                        <div className="min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-bold text-gray-900 truncate">{customerName}</h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{apt.customer_email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold whitespace-nowrap">
                                                    {format(startDate, "d MMM, yyyy", { locale: es })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold whitespace-nowrap">
                                                    {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Scissors className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold whitespace-nowrap">{apt.staff_name || 'Sin asignar'}</span>
                                            </div>
                                        </div>

                                        {/* Services & Notes */}
                                        <div className="flex-1">
                                            {apt.services && (
                                                <p className="text-xs text-gray-600 font-medium">
                                                    <span className="text-gray-400 uppercase text-[10px] font-bold mr-1">Servicios:</span>
                                                    {(() => {
                                                        try {
                                                            const svcs = JSON.parse(apt.services);
                                                            return Array.isArray(svcs) ? svcs.join(' + ') : svcs;
                                                        } catch {
                                                            return apt.services;
                                                        }
                                                    })()}
                                                </p>
                                            )}
                                            {apt.notes && (
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                    <span className="text-gray-400 uppercase text-[10px] font-bold mr-1">Nota:</span>
                                                    {apt.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                        <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                                            {getStatusLabel(apt.status)}
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
                                                    await cancelAppointment(apt.id);
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            title="Eliminar cita"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </PrivacyGuard>
        </div>
    )
}
