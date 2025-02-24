"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/supabase/client";

import Link from "next/link";
import BackButton from "@/components/BackButton";
import { usePlayer } from '@/hooks/usePlayer';

interface Player {
  id: string;
  name: string;
  emoji?: string;
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
  const [playersData, setPlayersData] = useState<Player[]>([]);
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

        const fetchedPlayers = await Promise.all(
          game.players.map(async (playerBasic: { id: string }) => {
            const { data: playerData } = await supabase
              .from('players')
              .select('*')
              .eq('id', playerBasic.id)
              .single();
            
            return {
              ...playerData,
              emoji: playerData?.emoji || '🎮'
            };
          })
        );

        setPlayersData(fetchedPlayers);
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
    <div className="">
      <div className="bg-white rounded-xl shadow-lg pb-16">
        <div className="flex justify-start items-center px-4 p-4">
          <BackButton />
          <h2 className="text-md mx-4">Anotador</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr>
                <th className="p-2 text-sm">Ronda</th>
                {playersData.map((player) => (
                  <th key={player.id} className="p-2 text-sm" colSpan={2}>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                      <span className="mr-2 text-xl">
                        {player.emoji || "🎮"}
                      </span>
                      <span className="text-gray-700">
                        {player.name?.toLowerCase()}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50/50">
                <th className="p-2 "></th>
                {gameState.players.map((player) => (
                  <React.Fragment key={player.id}>
                    <th className="p-2 text-sm   ">Apuesta</th>
                    <th className="p-2 text-sm">Resultado</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {gameState.rounds.map((round, roundIndex) => (
                <tr key={roundIndex}>
                  <td className="p-2 text-center font-medium text-sm">
                    {
                      generateRoundSequence(gameState.rounds.length / 2 + 0.5)[
                        roundIndex
                      ]
                    }
                  </td>
                  {round.map((cell, playerIndex) => (
                    <React.Fragment key={`${roundIndex}-${playerIndex}`}>
                      <td className="p-1 text-sm">
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
                          className="w-full h-8 text-center border-b border-gray-300 focus:outline-none focus:border-violet-500"
                          min="0"
                          max="9"
                        />
                      </td>
                      <td className="p-1">
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
                          className="w-full h-8 text-center border-b border-gray-300 focus:outline-none focus:border-violet-500"
                          min="0"
                          max="9"
                        />
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="p-2 text-center text-sm">Total</td>
                {totals.map((total, index) => (
                  <td
                    key={index}
                    className="p-2 text-center text-sm"
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
