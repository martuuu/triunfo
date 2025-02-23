"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { supabase } from "../supabase/client"

interface GameScoreProps {
  gameId: string
}

export default function GameScore({ gameId }: GameScoreProps) {
  // ... resto del código actual de game.tsx ...
  
  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;

      const { data: game, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single()

      if (error) {
        console.error("Error fetching game:", error)
        return
      }

      if (game) {
        setGameState({
          players: game.players,
          rounds: Array(game.total_rounds).fill(Array(game.players.length).fill({ bet: "", result: "" }))
        })
      }
    }

    fetchGameData()
  }, [gameId])

  // ... resto del código ...
}