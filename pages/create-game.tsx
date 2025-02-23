"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { supabase } from "../supabase/client";
import Alert from "../components/alert";

export default function CreateGame() {
  const router = useRouter();
  const [players, setPlayers] = useState(3);
  const [rounds, setRounds] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [matchedPlayers, setMatchedPlayers] = useState(false);

  useEffect(() => {
    const maxPossibleRounds = Math.floor(50 / players);
    const maxRounds = Math.min(9, maxPossibleRounds); // No más de 9 rondas
    if (rounds > maxRounds) {
      setRounds(maxRounds);
    } else if (rounds < 4) {
      // No menos de 4 rondas
      setRounds(4);
    }
  }, [players, rounds]);

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

    if (selectedPlayers.length !== players) {
      setMatchedPlayers(true);
      return;
    }

    const { data, error } = await supabase
      .from("games")
      .insert([{ 
        created_by: selectedPlayers[0].id,
        players: selectedPlayers.map(player => ({
          id: player.id,
          name: player.name
        })),
        total_rounds: rounds,
        current_round: 1,
        status: 'active'
      }])
      .select()

    if (error) {
      console.error(error);
    } else {
      router.push(`/game/${data[0].id}`) // Nueva ruta usando el App Router
    }
  };

  const handleAlertClose = () => {
    setMatchedPlayers(false);
    setShowAlert(false);
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
        {matchedPlayers && (
          <Alert
            onClose={handleAlertClose}
            variant="warning"
            text="La cantidad de jugadores seleccionados es incompleta."
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Configuración de Partida</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <span>Cantidad de Jugadores</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="border border-gray-300 rounded p-2 bg-sky-400 text-white hover:bg-blue-600"
                    onClick={() => setPlayers(Math.max(3, players - 1))}
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
                    className="border border-gray-300 rounded p-2 bg-sky-400 text-white hover:bg-blue-600"
                    onClick={() => setPlayers(Math.min(8, players + 1))}
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
                    className="border border-gray-300 rounded p-2 bg-sky-400 text-white hover:bg-blue-600"
                    onClick={() => setRounds(Math.max(4, rounds - 1))}
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
                    className="border border-gray-300 rounded p-2 bg-sky-400 text-white hover:bg-blue-600"
                    onClick={() =>
                      setRounds(
                        Math.min(
                          9,
                          Math.min(Math.floor(50 / players), rounds + 1)
                        )
                      )
                    }
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

              <div className="">
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
                onClick={() => setShowAlert(true)}
                className="w-full bg-sky-400 text-white py-2 rounded-md hover:bg-blue-600"
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
