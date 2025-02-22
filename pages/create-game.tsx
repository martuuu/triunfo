"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../supabase/client";

export default function CreateGame() {
  const [players, setPlayers] = useState(2);
  const [rounds, setRounds] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .ilike("name", `%${searchTerm}%`);
      if (error) {
        console.error(error);
      } else {
        setSearchResults(data);
      }
    };

    fetchPlayers();
  }, [searchTerm]);

  const handlePlayerSelect = (player: any) => {
    if (!selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("games")
      .insert([{ created_by: selectedPlayers[0].id }]); // Reemplaza con el ID del jugador que crea la partida
    if (error) {
      console.error(error);
    } else {
      console.log("Game created:", data);
      // Aquí puedes redirigir a la página de la partida o mostrar un mensaje de éxito
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <button className="mb-4 flex items-center text-gray-600 hover:text-gray-800">
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Atrás
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Configuración de Partida</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <span>Cantidad de Jugadores</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="border border-gray-300 rounded p-2"
                    onClick={() => setPlayers(Math.max(2, players - 1))}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-12 text-center">{players}</span>
                  <button
                    type="button"
                    className="border border-gray-300 rounded p-2"
                    onClick={() => setPlayers(players + 1)}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Cantidad de Rondas</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="border border-gray-300 rounded p-2"
                    onClick={() => setRounds(Math.max(1, rounds - 1))}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-12 text-center">{rounds}</span>
                  <button
                    type="button"
                    className="border border-gray-300 rounded p-2"
                    onClick={() => setRounds(rounds + 1)}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar Jugadores</label>
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <div className="space-y-1">
                  {searchResults.map((player) => (
                    <div
                      key={player.id}
                      className="cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                      onClick={() => handlePlayerSelect(player)}
                    >
                      {player.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">
                  Jugadores Seleccionados
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPlayers.map((player) => (
                    <span
                      key={player.id}
                      className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded"
                    >
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Crear Partida
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
