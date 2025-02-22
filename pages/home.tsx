import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
          Triunfo
        </h1>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-6">
        <div className="grid gap-4">
          <Link href="/create-player" className="block">
            <button className="w-full border border-sky-400 text-sky-400 py-2 px-4 rounded-md hover:bg-sky-50 transition-colors">
              Crear Jugador
            </button>
          </Link>
          <Link href="/login" className="block">
            <button className="w-full text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
              Iniciar Sesión
            </button>
          </Link>
        <div className="border-t border-gray-200 my-4"></div>
          <Link href="/create-game" className="block">
            <button className="w-full bg-sky-400 text-white py-2 px-4 rounded-md hover:bg-sky-500 transition-colors">
              Crear Partida
            </button>
          </Link>
          <Link href="/game" className="block">
            <button className="w-full bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 transition-colors">
              Partida en Curso
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
