'use client'

import { useState } from 'react'
import {
    Plus, Trash2, Edit2, Check, X, Clock, DollarSign, Tag,
    Image as ImageIcon, MapPin, Instagram, Facebook, Globe, Layout, Filter, User, Mail, Scissors, Calendar
} from 'lucide-react'
import {
    createService, updateService, deleteService,
    createStaff, deleteStaff, updateLocation,
    updateSettings, addPortfolioImage, deletePortfolioImage
} from '@/app/actions'

export default function AdminCMS({ tab, services, staff, locations, settings, portfolio }: any) {
    if (tab === 'services') return <ServicesTab services={services} />
    if (tab === 'staff') return <StaffTab staff={staff} />
    if (tab === 'content') return <ContentTab locations={locations} settings={settings} portfolio={portfolio} />
    return null
}

// Services Tab
function ServicesTab({ services }: { services: any[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <h2 className="text-xl font-bold text-gray-900 uppercase">Gestión de Servicios</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Servicio</span>
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <ServiceForm onCancel={() => setIsAdding(false)} onSubmit={createService} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm group hover:border-gray-300 transition-all flex flex-col">
                        {editingId === s.id ? (
                            <ServiceForm
                                initial={s}
                                onCancel={() => setEditingId(null)}
                                onSubmit={(formData: FormData) => updateService(s.id, formData)}
                            />
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="overflow-hidden">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{s.category}</span>
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{s.name}</h3>
                                    </div>
                                    <div className="flex shrink-0 gap-1.5">
                                        <button onClick={() => setEditingId(s.id)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteService(s.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed flex-grow line-clamp-2">{s.description}</p>
                                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-700">{s.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-bold text-gray-900">{s.price}</span>
                                        </div>
                                    </div>
                                    {s.popular === 1 && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[9px] font-bold uppercase tracking-wider border border-amber-100">Popular</span>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function ServiceForm({ initial, onCancel, onSubmit }: any) {
    return (
        <form action={async (formData) => {
            await onSubmit(formData);
            onCancel();
        }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre</label>
                    <input name="name" defaultValue={initial?.name} placeholder="Nombre" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" required />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Precio</label>
                    <input name="price" defaultValue={initial?.price} placeholder="Ej: 25€" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" required />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Duración</label>
                    <input name="duration" defaultValue={initial?.duration} placeholder="Ej: 30 min" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" required />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Categoría</label>
                    <input name="category" defaultValue={initial?.category} placeholder="Ej: Corte" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" required />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Descripción</label>
                <textarea name="description" defaultValue={initial?.description} placeholder="Descripción..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none min-h-[80px] resize-none" />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="popular" value="true" defaultChecked={initial?.popular === 1} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black/10" />
                    <span className="text-[10px] font-bold uppercase text-gray-500">Destacar como Popular</span>
                </label>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-[10px] font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" className="bg-black text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Guardar</span>
                    </button>
                </div>
            </div>
        </form>
    )
}

function StaffTab({ staff }: { staff: any[] }) {
    const [isAdding, setIsAdding] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <h2 className="text-xl font-bold text-gray-900 uppercase">Equipo de Barberos</h2>
                <button onClick={() => setIsAdding(true)} className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Miembro</span>
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <form action={async (fd) => { await createStaff(fd); setIsAdding(false); }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                                <input name="name" placeholder="Nombre completo" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">URL Avatar / Imagen</label>
                                <input name="avatar_url" placeholder="URL del Avatar" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-[10px] font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cerrar</button>
                            <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Crear Miembro</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {staff.map((s) => (
                    <div key={s.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center relative group">
                        <div className="relative mb-4 inline-block">
                            <img src={s.avatar_url} className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-gray-100" />
                            <button
                                onClick={() => deleteStaff(s.id)}
                                className="absolute -top-1 -right-1 p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase truncate px-2">{s.name}</h3>
                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Barbero</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ContentTab({ locations, settings, portfolio }: any) {
    const loc = locations[0]
    const getSetting = (key: string) => settings.find((s: any) => s.key === key)?.value || ''
    const [isAddingPortfolio, setIsAddingPortfolio] = useState(false)

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Datos del Establecimiento */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <MapPin className="w-5 h-5 text-gray-900" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Información Básica</h3>
                    </div>

                    <form action={async (fd) => { await updateLocation(loc.id, fd); }} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Comercial</label>
                            <input name="name" defaultValue={loc.name} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Dirección Completa</label>
                            <input name="address" defaultValue={loc.address} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono de Contacto</label>
                            <input name="phone" defaultValue={loc.phone} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider mt-2">Actualizar Datos</button>
                    </form>
                </section>

                {/* 1.5. Horarios de Apertura */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <Clock className="w-5 h-5 text-gray-900" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Horarios</h3>
                    </div>
                    <form action={async (fd) => { await updateSettings(fd); }} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { key: 'schedule_monday', label: 'Lunes' },
                                { key: 'schedule_tuesday', label: 'Martes' },
                                { key: 'schedule_wednesday', label: 'Miércoles' },
                                { key: 'schedule_thursday', label: 'Jueves' },
                                { key: 'schedule_friday', label: 'Viernes' },
                                { key: 'schedule_saturday', label: 'Sábado' },
                                { key: 'schedule_sunday', label: 'Domingo' },
                            ].map((day) => (
                                <div key={day.key} className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{day.label}</label>
                                    <input name={day.key} defaultValue={getSetting(day.key)} placeholder="Ej: 10:00 - 20:00" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider mt-3">Guardar Horarios</button>
                    </form>
                </section>
            </div>

            {/* 2. Personalización Web */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <Layout className="w-5 h-5 text-gray-900" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Contenido Desktop / Mobile</h3>
                </div>
                <form action={async (fd) => { await updateSettings(fd); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Título Hero (Portada)</label>
                            <input name="hero_title" defaultValue={getSetting('hero_title')} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Subtítulo Hero</label>
                            <input name="hero_subtitle" defaultValue={getSetting('hero_subtitle')} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Imagen Principal (URL)</label>
                            <input name="hero_image" defaultValue={getSetting('hero_image')} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sobre Nosotros / Biografía</label>
                            <textarea name="about_text" defaultValue={getSetting('about_text')} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none min-h-[100px] resize-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5"><Instagram className="w-3 h-3" /> Instagram URL</label>
                            <input name="instagram_url" defaultValue={getSetting('instagram_url')} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5"><Facebook className="w-3 h-3" /> Facebook URL</label>
                            <input name="facebook_url" defaultValue={getSetting('facebook_url')} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="bg-black text-white px-8 py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm">Guardar Cambios Visuales</button>
                </form>
            </section>

            {/* 3. Portafolio */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-gray-900" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Galería Portafolio</h3>
                    </div>
                    <button onClick={() => setIsAddingPortfolio(true)} className="p-2 bg-gray-50 hover:bg-black hover:text-white rounded-lg transition-colors border border-gray-100">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {isAddingPortfolio && (
                        <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <form action={async (fd) => { await addPortfolioImage(fd); setIsAddingPortfolio(false); }} className="space-y-2 w-full">
                                <input name="image_url" placeholder="URL Imagen" className="w-full bg-white border border-gray-200 rounded-md p-2 text-[10px] font-bold outline-none" required />
                                <input name="tag" placeholder="Etiqueta" className="w-full bg-white border border-gray-200 rounded-md p-2 text-[10px] font-bold outline-none" />
                                <div className="flex gap-1.5">
                                    <button type="submit" className="flex-grow bg-black text-white p-2 rounded-md text-[9px] font-black uppercase">Ok</button>
                                    <button type="button" onClick={() => setIsAddingPortfolio(false)} className="bg-white p-2 rounded-md text-[9px] font-black uppercase border border-gray-200">X</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {portfolio.map((img: any) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-100 shadow-sm">
                            <img src={img.image_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-white uppercase tracking-widest mb-3">{img.tag}</p>
                                    <button onClick={() => deletePortfolioImage(img.id)} className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
