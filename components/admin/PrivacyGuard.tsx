'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react'

interface PrivacyGuardProps {
    children: React.ReactNode
    label?: string
}

export default function PrivacyGuard({ children, label = "Datos Sensibles" }: PrivacyGuardProps) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false)
    const [isPromptOpen, setIsPromptOpen] = useState(false)

    useEffect(() => {
        const saved = sessionStorage.getItem('admin_privacy_unlocked')
        if (saved === 'true') {
            setIsUnlocked(true)
        }
    }, [])

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'knowme') {
            setIsUnlocked(true)
            setError(false)
            setIsPromptOpen(false)
            sessionStorage.setItem('admin_privacy_unlocked', 'true')
        } else {
            setError(true)
            setPassword('')
        }
    }

    if (isUnlocked) {
        return <>{children}</>
    }

    return (
        <div className="relative group">
            {/* Blurred Content */}
            <div className="blur-[12px] opacity-40 select-none pointer-events-none transition-all">
                {children}
            </div>

            {/* Clickable Overlay */}
            {!isPromptOpen ? (
                <button
                    onClick={() => setIsPromptOpen(true)}
                    className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center bg-transparent group-hover:bg-black/5 transition-all cursor-pointer rounded-xl"
                >
                    <div className="bg-white/90 backdrop-blur shadow-xl border border-gray-200 px-6 py-3 rounded-full flex items-center gap-3 scale-90 group-hover:scale-100 transition-transform">
                        <Lock className="w-4 h-4 text-gray-900" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Pulsar para ver {label}</span>
                    </div>
                </button>
            ) : (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[320px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                                <Lock className="w-5 h-5" />
                            </div>
                            <button onClick={() => setIsPromptOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">Acceso Protegido</h4>
                        <p className="text-[10px] text-gray-500 font-medium mb-5">Introduce contraseña del gestor</p>

                        <form onSubmit={handleUnlock} className="space-y-3">
                            <div className="relative">
                                <input
                                    autoFocus
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError(false)
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full bg-gray-50 border ${error ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-200 focus:border-black'} rounded-lg py-3 px-4 text-sm font-bold transition-all outline-none pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {error && (
                                <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                                    Clave Incorrecta
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-gray-900 transition-all"
                            >
                                Desbloquear
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
