"use client"

import { useEffect } from "react"
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { useGameStore } from "@/lib/game-store"
import { Player } from "./player"
import { Zombie } from "./zombie"
import { MapEnvironment } from "./map-environment"

export function GameWorld() {
  const gameState = useGameStore((state) => state.gameState)
  const selectedMap = useGameStore((state) => state.selectedMap)
  const wave = useGameStore((state) => state.wave)
  const incrementWave = useGameStore((state) => state.incrementWave)
  const zombies = useGameStore((state) => state.zombies)
  const addZombie = useGameStore((state) => state.addZombie)
  const removeZombie = useGameStore((state) => state.removeZombie)

  // Spawn zombies based on wave
  useEffect(() => {
    if (gameState !== "playing") return

    const zombieCount = Math.min(5 + wave * 2, 20) // Cap at 20 zombies

    // Only spawn new zombies if we're below the target count
    if (zombies.length < zombieCount) {
      const spawnInterval = setInterval(() => {
        if (zombies.length >= zombieCount) {
          clearInterval(spawnInterval)
          return
        }

        // Spawn zombie at random position away from player
        const angle = Math.random() * Math.PI * 2
        const distance = 15 + Math.random() * 10
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance

        addZombie({
          id: `zombie-${Date.now()}-${Math.random()}`,
          position: [x, 0, z],
          health: 100,
          speed: 0.5 + wave * 0.05, // Zombies get faster with each wave
          damage: 10 + wave * 2, // Zombies get stronger with each wave
        })
      }, 1000)

      return () => clearInterval(spawnInterval)
    }

    // Check if all zombies are dead to advance to next wave
    if (zombies.length === 0 && wave > 0) {
      const nextWaveTimeout = setTimeout(() => {
        incrementWave()
      }, 3000)

      return () => clearTimeout(nextWaveTimeout)
    }
  }, [gameState, wave, zombies.length, addZombie, incrementWave])

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
        { name: "reload", keys: ["r", "R"] },
      ]}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />

      <Physics gravity={[0, -9.81, 0]}>
        <Player />

        {zombies.map((zombie) => (
          <Zombie key={zombie.id} zombie={zombie} onDeath={() => removeZombie(zombie.id)} />
        ))}

        <MapEnvironment mapType={selectedMap} />
      </Physics>

      {selectedMap === "warehouse" && <fog attach="fog" color="#111111" near={1} far={30} />}

      {selectedMap === "forest" && (
        <>
          <Sky sunPosition={[0, 0.1, 0]} inclination={0.1} />
          <fog attach="fog" color="#151b10" near={1} far={40} />
        </>
      )}

      {selectedMap === "city" && (
        <>
          <Sky sunPosition={[0, -0.1, 0]} inclination={0.5} />
          <fog attach="fog" color="#101010" near={1} far={50} />
        </>
      )}

      <PointerLockControls />
    </KeyboardControls>
  )
}
