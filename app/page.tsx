
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center text-center space-y-8 max-w-md w-full">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Pablo BarberShop
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          La mejor experiencia de barbería, ahora en la palma de tu mano. Agenda tu cita en segundos.
        </p>

        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-full bg-black dark:bg-white text-white dark:text-black px-8 py-3 font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto text-center"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-gray-300 dark:border-gray-700 bg-transparent px-8 py-3 font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto text-center"
          >
            Registrarse
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        &copy; 2026 Pablo BarberShop. Todos los derechos reservados.
      </footer>
    </div>
  );
}
