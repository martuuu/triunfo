"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";
// import Alert from "@/components/Alert";
import BackButton from "@/components/BackButton";

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

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(
      selectedPlayers.filter((player) => player.id !== playerId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlayers.length !== players) {
      setMatchedPlayers(true);
      return;
    }

    const { data, error } = await supabase
      .from("games")
      .insert([
        {
          created_by: selectedPlayers[0].id,
          players: selectedPlayers.map((player) => ({
            id: player.id,
            name: player.name,
          })),
          total_rounds: rounds,
          current_round: 1,
          status: "active",
        },
      ])
      .select();

    if (error) {
      console.error(error);
    } else {
      router.push(`/game/${data[0].id}`); // Nueva ruta usando el App Router
    }
  };

  const handleAlertClose = () => {
    setMatchedPlayers(false);
    setShowAlert(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="">
        {/* {matchedPlayers && (
          <Alert
            onClose={handleAlertClose}
            variant="warning"
            text="La cantidad de jugadores seleccionados es incompleta."
          />
        )} */}
        <div className="bg-white rounded-xl shadow-lg p-4 pb-16 md:p-8">
          <div className="flex justify-start items-center mb-6">
            <BackButton />
            <h2 className="text-md mx-4">Configuración de Partida</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <span>Cantidad de Jugadores</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="border bg-gradient-to-r from-indigo-400 to-violet-500 rounded p-2 text-white hover:bg-violet-600 transition-colors"
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
                    className="border bg-gradient-to-r from-indigo-400 to-violet-500 rounded p-2 text-white hover:bg-violet-600 transition-colors"
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
                    className="border bg-gradient-to-r from-indigo-400 to-violet-500 rounded p-2 text-white hover:bg-violet-600 transition-colors"
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
                    className="border bg-gradient-to-r from-indigo-400 to-violet-500 rounded p-2 text-white hover:bg-violet-600 transition-colors"
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm text-gray-400 font-medium mb-2"
                />
                <div className="space-y-1 ">
                  {searchResults.map((player) => (
                    <div
                      key={player.id}
                      className="cursor-pointer p-2 text-gray-500 font-medium mb-2 border border-gray-200 rounded-md hover:bg-gray-100"
                      onClick={() => handlePlayerSelect(player)}
                    >
                      {player.name.toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-violet-200 rounded-md p-4">
                {!selectedPlayers.length && (
                  <div className="text-sm text-gray-400 font-medium mb-2">
                    Jugadores Seleccionados
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100"
                    >
                      <span className="mr-2 text-xl">
                        {player.emoji || "💩"}
                      </span>
                      <span className="text-gray-700">
                        {player.name?.toLowerCase() || player.email}
                      </span>
                      <div className="mx-2 h-4 w-px bg-gray-300" />
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar jugador"
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
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 max-w-sm mx-auto">
                  <button
                    type="submit"
                    onClick={() => setShowAlert(true)}
                    className="w-full bg-gradient-to-r from-indigo-400 to-violet-500 text-white py-3 px-6 rounded-md hover:bg-violet-600 transition-colors"
                  >
                    Crear Partida
                  </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
