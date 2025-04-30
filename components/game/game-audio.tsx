"use client"

import { useEffect, useRef } from "react"
import { useGameStore } from "@/lib/game-store"

export function GameAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const gameState = useGameStore((state) => state.gameState)
  const selectedMap = useGameStore((state) => state.selectedMap)

  useEffect(() => {
    if (!audioRef.current) return

    if (gameState === "playing") {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
    } else {
      audioRef.current.pause()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [gameState])

  // Different ambient sounds based on map
  const ambientSound =
    selectedMap === "warehouse"
      ? "/ambient-warehouse.mp3"
      : selectedMap === "forest"
        ? "/ambient-forest.mp3"
        : "/ambient-city.mp3"

  return <audio ref={audioRef} src={ambientSound} loop crossOrigin="anonymous" />
}
