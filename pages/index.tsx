import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [hasActiveGame, setHasActiveGame] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/"); // Redirige al inicio después del logout
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Efecto para verificar si hay una partida activa
  useEffect(() => {
    const checkActiveGame = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("games")
          .select("*")
          .eq("status", "active")
          .single();

        if (data && !error) {
          setHasActiveGame(true);
        }
      }
    };

    checkActiveGame();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center p-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
          Triunfo
        </h1>
        {user && (
          <div className="mt-8 inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
            <span className="mr-2 text-xl">
              {user.user_metadata.emoji || "🎮"}
            </span>
            <span className="text-gray-700">
              {user.user_metadata.name?.toLowerCase() || user.email}
            </span>
            <div className="mx-2 h-4 w-px bg-gray-300" />{" "}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid gap-4">
            {!user && (
              <>
                <Link href="/create-player" className="block">
                  <button className="w-full border border-violet-500 text-violet-500 py-2 px-4 rounded-md hover:bg-violet-50 transition-colors">
                    Crear Jugador
                  </button>
                </Link>
                <Link href="/login" className="block">
                  <button className="w-full bg-gradient-to-r from-indigo-400 to-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 transition-colors">
                    Iniciar Sesión
                  </button>
                </Link>
              </>
            )}

            {user && (
              <>
                <Link href="/create-game" className="block">
                  <button className="w-full bg-gradient-to-r from-indigo-400 to-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 transition-colors">
                    Crear Partida
                  </button>
                </Link>
                <Link href="/game" className="block">
                  <button
                    disabled={!hasActiveGame}
                    className={`w-full border py-2 px-4 rounded-md transition-colors ${
                      hasActiveGame
                        ? "border-violet-500 text-violet-500 hover:bg-violet-50"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Partida en Curso
                  </button>
                </Link>
              </>
            )}
          </div>
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-400">developed by</p>
            <img
              src="/images/grape.png"
              alt="Company Logo"
              width={90}
              height={30}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
