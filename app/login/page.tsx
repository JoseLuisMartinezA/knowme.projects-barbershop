
'use client'

import { useActionState, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { login, type ActionState } from '@/app/actions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User, Lock, LogIn, ShieldCheck, ArrowLeft } from 'lucide-react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-black text-white p-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all disabled:opacity-50 shadow-xl text-[10px] active:scale-[0.98]"
        >
            {pending ? 'Verificando...' : 'Acceder al Sistema'}
        </button>
    )
}

const initialState: ActionState = {
    error: null,
    success: false,
    message: null
}

function LoginForm() {
    const searchParams = useSearchParams()
    const verified = searchParams.get('verified')
    const [state, formAction] = useActionState(login, initialState)

    return (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-black/5 border border-gray-100 relative overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 gold-gradient opacity-80" />

            <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
                        <LogIn className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2 leading-none">
                    Identificación
                </h2>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-amber-400" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
                        Panel de Gestión & Administración
                    </p>
                </div>
            </div>

            {verified && (
                <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-center font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Email verificado correctamente
                </div>
            )}

            <form action={formAction} className="space-y-6">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail o Usuario</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-5 py-4 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all placeholder:text-gray-300 font-bold"
                                placeholder="Introduce tu usuario"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-5 py-4 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all placeholder:text-gray-300 font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                {state?.error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-center text-[9px] font-black uppercase tracking-widest animate-shake">
                        {state.error}
                    </div>
                )}

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Volver a la Web
                </Link>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase text-[10px] tracking-widest">Iniciando entorno...</div>}>
            <main className="min-h-screen bg-gray-50 flex flex-col justify-center relative overflow-hidden px-4">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="w-full max-w-lg mx-auto z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <LoginForm />

                    <div className="mt-12 flex flex-col items-center gap-4">
                        <p className="text-gray-300 text-[9px] uppercase tracking-[0.4em] font-black">
                            SISTEMA SEGURO • BARBERSHOP 2026
                        </p>
                    </div>
                </div>
            </main>
        </Suspense>
    )
}

