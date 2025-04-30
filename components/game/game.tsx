"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { GameUI } from "./game-ui"
import { GameMenu } from "./game-menu"
import { GameOver } from "./game-over"
import { GameWorld } from "./game-world"
import { useGameStore } from "@/lib/game-store"
import { Loader } from "@react-three/drei"
import { GameAudio } from "./game-audio"

export default function Game() {
  const [isClient, setIsClient] = useState(false)
  const gameState = useGameStore((state) => state.gameState)
  const playerHealth = useGameStore((state) => state.playerHealth)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <>
      {gameState === "menu" && <GameMenu />}

      {(gameState === "playing" || gameState === "gameover") && (
        <>
          <GameAudio />
          <Canvas shadows camera={{ fov: 75, position: [0, 1.6, 0] }}>
            <Suspense fallback={null}>
              <GameWorld />
            </Suspense>
          </Canvas>

          {gameState === "playing" && <GameUI />}
          {gameState === "gameover" && <GameOver />}
        </>
      )}

      <Loader />
    </>
  )
}
