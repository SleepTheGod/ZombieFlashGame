"use client"

import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { Skull } from "lucide-react"

export function GameOver() {
  const restartGame = useGameStore((state) => state.restartGame)
  const returnToMenu = useGameStore((state) => state.returnToMenu)
  const score = useGameStore((state) => state.score)
  const zombiesKilled = useGameStore((state) => state.zombiesKilled)
  const wave = useGameStore((state) => state.wave)

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-lg shadow-2xl border border-red-800 text-center">
        <Skull className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-6">GAME OVER</h1>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Final Score:</span>
            <span className="text-white font-bold text-xl">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Zombies Killed:</span>
            <span className="text-white font-bold">{zombiesKilled}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Wave Reached:</span>
            <span className="text-white font-bold">{wave}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button onClick={restartGame} className="bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
          <Button
            onClick={returnToMenu}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-900 hover:text-white"
          >
            Return to Menu
          </Button>
        </div>
      </div>
    </div>
  )
}
