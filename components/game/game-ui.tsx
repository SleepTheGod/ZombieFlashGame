"use client"
import { useGameStore } from "@/lib/game-store"
import { Heart, Skull, Crosshair } from "lucide-react"

export function GameUI() {
  const playerHealth = useGameStore((state) => state.playerHealth)
  const ammo = useGameStore((state) => state.ammo)
  const score = useGameStore((state) => state.score)
  const zombiesKilled = useGameStore((state) => state.zombiesKilled)
  const wave = useGameStore((state) => state.wave)
  const selectedWeapon = useGameStore((state) => state.selectedWeapon)

  return (
    <>
      {/* Crosshair */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <Crosshair className="w-6 h-6 text-red-500 opacity-70" />
      </div>

      {/* Health bar */}
      <div className="fixed bottom-6 left-6 bg-black bg-opacity-50 p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${playerHealth}%` }} />
          </div>
          <span className="ml-2 text-white font-bold">{playerHealth}</span>
        </div>

        {/* Ammo counter */}
        <div className="flex items-center">
          <span className="text-white font-bold mr-2 uppercase">{selectedWeapon}:</span>
          <span className="text-white font-mono">
            {ammo} / {selectedWeapon === "pistol" ? 12 : selectedWeapon === "shotgun" ? 8 : 30}
          </span>
        </div>
      </div>

      {/* Score and wave info */}
      <div className="fixed top-6 right-6 bg-black bg-opacity-50 p-3 rounded-lg text-right">
        <div className="flex items-center justify-end mb-1">
          <span className="text-white font-bold mr-2">SCORE:</span>
          <span className="text-white font-mono">{score}</span>
        </div>
        <div className="flex items-center justify-end mb-1">
          <span className="text-white font-bold mr-2">WAVE:</span>
          <span className="text-white font-mono">{wave}</span>
        </div>
        <div className="flex items-center justify-end">
          <Skull className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-white font-mono">{zombiesKilled}</span>
        </div>
      </div>

      {/* Wave notification */}
      <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {wave > 1 && <div className="animate-pulse text-red-600 text-4xl font-bold text-center">Wave {wave}</div>}
      </div>
    </>
  )
}
