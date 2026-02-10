
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { register } from '@/app/actions'
import Link from 'next/link'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full bg-black text-white p-3 rounded-lg font-medium transition-colors ${pending ? 'opacity-50' : 'hover:bg-gray-800'}`}
        >
            {pending ? 'Registrando...' : 'Crear Cuenta'}
        </button>
    )
}

const initialState = {
    error: '',
    success: false, // Wait, I should handle success state
    message: ''
}

export default function RegisterPage() {
    const [state, formAction] = useActionState(register, initialState)

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Crear una cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Regístrate para reservar tus citas
                    </p>
                </div>

                {state?.success ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">¡Registro exitoso! </strong>
                        <span className="block sm:inline">{state.message || 'Revisa tu email para verificar la cuenta.'}</span>
                        <div className="mt-4">
                            <Link href="/login" className="underline font-bold">Ir a Iniciar Sesión</Link>
                        </div>
                    </div>
                ) : (
                    <form action={formAction} className="mt-8 space-y-6">
                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm text-center">
                                {state.error}
                            </div>
                        )}

                        <div>
                            <SubmitButton />
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-gray-500">¿Ya tienes cuenta? </span>
                            <Link href="/login" className="font-medium text-black hover:underline">
                                Inicia Sesión
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
