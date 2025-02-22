"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

interface Player {
  id: string
  name: string
}

interface Round {
  bet: string
  result: string
}

interface GameState {
  players: Player[]
  rounds: Round[][]
}

export default function GameScore() {
  const [gameState, setGameState] = useState<GameState>({
    players: [
      { id: "1", name: "Jugador 1" },
      { id: "2", name: "Jugador 2" },
      { id: "3", name: "Jugador 3" },
    ],
    rounds: Array(5).fill(Array(3).fill({ bet: "", result: "" })),
  })

  const [totals, setTotals] = useState<number[]>([])

  const calculateTotals = useCallback(() => {
    const newTotals = gameState.players.map((_, playerIndex) => {
      return gameState.rounds.reduce((total, round) => {
        const result = Number.parseInt(round[playerIndex].result) || 0
        return total + result
      }, 0)
    })
    setTotals(newTotals)
  }, [gameState.players, gameState.rounds])

  useEffect(() => {
    calculateTotals()
  }, [calculateTotals])

  const handleInputChange = (playerIndex: number, roundIndex: number, field: "bet" | "result", value: string) => {
    const newRounds = gameState.rounds.map((round, rIndex) => {
      if (rIndex === roundIndex) {
        const newRound = [...round]
        newRound[playerIndex] = {
          ...newRound[playerIndex],
          [field]: value,
        }
        return newRound
      }
      return round
    })

    setGameState((prev) => ({
      ...prev,
      rounds: newRounds,
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/create-game">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
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
        <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
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
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          Editar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 p-2">Ronda</th>
              {gameState.players.map((player) => (
                <th key={player.id} className="border border-gray-200 p-2" colSpan={2}>
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
                <td className="border border-gray-200 p-2 text-center font-medium">{roundIndex + 1}</td>
                {round.map((cell, playerIndex) => (
                  <React.Fragment key={`${roundIndex}-${playerIndex}`}>
                    <td className="border border-gray-200 p-1">
                      <input
                        type="number"
                        value={cell.bet}
                        onChange={(e) => handleInputChange(playerIndex, roundIndex, "bet", e.target.value)}
                        className="h-6 w-12 text-center px-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                        min="0"
                        max="9"
                      />
                    </td>
                    <td className="border border-gray-200 p-1">
                      <input
                        type="number"
                        value={cell.result}
                        onChange={(e) => handleInputChange(playerIndex, roundIndex, "result", e.target.value)}
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
              <td className="border border-gray-200 p-2 text-center">Total</td>
              {totals.map((total, index) => (
                <td key={index} className="border border-gray-200 p-2 text-center" colSpan={2}>
                  {total}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

