"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/supabase/client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

interface Player {
  id: string;
  name: string;
}

interface Round {
  bet: string;
  result: string;
}

interface GameState {
  players: Player[];
  rounds: Round[][];
}

export default function GamePage() {
  const params = useParams();
  const id = params?.id as string; // Add type assertion and optional chaining
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    rounds: [],
  });

  const [totals, setTotals] = useState<number[]>([]);

  const calculateTotals = useCallback(() => {
    const newTotals = gameState.players.map((_, playerIndex) => {
      return gameState.rounds.reduce((total, round) => {
        const result = Number.parseInt(round[playerIndex].result) || 0;
        return total + result;
      }, 0);
    });
    setTotals(newTotals);
  }, [gameState.players, gameState.rounds]);

  const generateRoundSequence = (totalRounds: number) => {
    const ascending = Array.from({ length: totalRounds }, (_, i) => i + 1);
    const descending = Array.from(
      { length: totalRounds - 1 },
      (_, i) => totalRounds - 1 - i
    );
    return [...ascending, ...descending];
  };

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!id) {
        console.error("No game ID provided");
        return;
      }

      const { data: game, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching game:", error);
        return;
      }

      if (game) {
        const roundSequence = generateRoundSequence(game.total_rounds);
        setGameState({
          players: game.players,
          rounds: roundSequence.map(() =>
            Array(game.players.length).fill({ bet: "", result: "" })
          ),
        });
      }
    };

    fetchGameData();
  }, [id]);

  const handleInputChange = (
    playerIndex: number,
    roundIndex: number,
    field: "bet" | "result",
    value: string
  ) => {
    const newRounds = [...gameState.rounds];
    newRounds[roundIndex][playerIndex] = {
      ...newRounds[roundIndex][playerIndex],
      [field]: value,
    };
    setGameState((prevState) => ({
      ...prevState,
      rounds: newRounds,
    }));
  };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <BackButton />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2">Ronda</th>
                {gameState.players.map((player) => (
                  <th
                    key={player.id}
                    className="border border-gray-200 p-2"
                    colSpan={2}
                  >
                    {player.name}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50/50">
                <th className="border border-gray-200 p-2"></th>
                {gameState.players.map((player) => (
                  <React.Fragment key={player.id}>
                    <th className="border border-gray-200 p-2">Apuesta</th>
                    <th className="border border-gray-200 p-2">Resultado</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {gameState.rounds.map((round, roundIndex) => (
                <tr key={roundIndex}>
                  <td className="border border-gray-200 p-2 text-center font-medium">
                    {
                      generateRoundSequence(gameState.rounds.length / 2 + 0.5)[
                        roundIndex
                      ]
                    }
                  </td>
                  {round.map((cell, playerIndex) => (
                    <React.Fragment key={`${roundIndex}-${playerIndex}`}>
                      <td className="border border-gray-200 p-1">
                        <input
                          type="number"
                          value={cell.bet}
                          onChange={(e) =>
                            handleInputChange(
                              playerIndex,
                              roundIndex,
                              "bet",
                              e.target.value
                            )
                          }
                          className="h-6 w-12 text-center px-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                          min="0"
                          max="9"
                        />
                      </td>
                      <td className="border border-gray-200 p-1">
                        <input
                          type="number"
                          value={cell.result}
                          onChange={(e) =>
                            handleInputChange(
                              playerIndex,
                              roundIndex,
                              "result",
                              e.target.value
                            )
                          }
                          className="h-6 w-12 text-center px-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                          min="0"
                          max="9"
                        />
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="border border-gray-200 p-2 text-center">
                  Total
                </td>
                {totals.map((total, index) => (
                  <td
                    key={index}
                    className="border border-gray-200 p-2 text-center"
                    colSpan={2}
                  >
                    {total}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
