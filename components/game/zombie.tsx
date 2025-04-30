"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import * as THREE from "three"
import { useGameStore } from "@/lib/game-store"

export function Zombie({ zombie, onDeath }) {
  const zombieRef = useRef()
  const [zombieState, setZombieState] = useState("idle") // idle, chasing, attacking, dead
  const [lastAttackTime, setLastAttackTime] = useState(0)
  const [hitFlash, setHitFlash] = useState(false)

  const { camera } = useThree()

  const playerHealth = useGameStore((state) => state.playerHealth)
  const decreasePlayerHealth = useGameStore((state) => state.decreasePlayerHealth)
  const gameState = useGameStore((state) => state.gameState)
  const increaseScore = useGameStore((state) => state.increaseScore)
  const increaseZombiesKilled = useGameStore((state) => state.increaseZombiesKilled)
  const selectedWeapon = useGameStore((state) => state.selectedWeapon)

  // Handle zombie hit
  const handleHit = (damage = 25) => {
    if (zombie.health <= 0) return

    setHitFlash(true)
    setTimeout(() => setHitFlash(false), 100)

    const newHealth = zombie.health - damage
    zombie.health = newHealth

    if (newHealth <= 0) {
      setZombieState("dead")
      increaseScore(100)
      increaseZombiesKilled()

      // Remove zombie after death animation
      setTimeout(() => {
        onDeath()
      }, 1000)
    }
  }

  // Expose hit function to global for raycasting
  useEffect(() => {
    if (!zombieRef.current) return

    // This would normally be handled through proper collision detection
    // For this demo, we're exposing the hit function globally
    window.addEventListener("mousedown", (e) => {
      if (gameState !== "playing") return

      // Simple hit detection based on camera direction and distance
      const zombiePosition = zombieRef.current.translation()
      const playerPosition = camera.position

      const distance = new THREE.Vector3(
        zombiePosition.x - playerPosition.x,
        zombiePosition.y - playerPosition.y,
        zombiePosition.z - playerPosition.z,
      ).length()

      if (distance < 10) {
        // Check if player is looking at zombie
        const direction = new THREE.Vector3()
        camera.getWorldDirection(direction)

        const zombieDirection = new THREE.Vector3(
          zombiePosition.x - playerPosition.x,
          zombiePosition.y - playerPosition.y,
          zombiePosition.z - playerPosition.z,
        ).normalize()

        const dot = direction.dot(zombieDirection)

        if (dot > 0.8) {
          // Hit zombie based on weapon damage
          const damage = selectedWeapon === "pistol" ? 25 : selectedWeapon === "shotgun" ? 75 : 15 // rifle

          handleHit(damage)
        }
      }
    })
  }, [gameState, camera, selectedWeapon])

  const handleHitRef = useRef(handleHit)

  useEffect(() => {
    handleHitRef.current = handleHit
  }, [handleHit])

  useFrame((state, delta) => {
    if (!zombieRef.current || gameState !== "playing" || zombieState === "dead") return

    // Get positions
    const zombiePosition = zombieRef.current.translation()
    const playerPosition = camera.position

    // Calculate distance to player
    const distance = new THREE.Vector3(
      zombiePosition.x - playerPosition.x,
      0, // Ignore Y axis for distance calculation
      zombiePosition.z - playerPosition.z,
    ).length()

    // Update zombie state based on distance
    if (distance < 1.5 && zombieState !== "attacking") {
      setZombieState("attacking")
    } else if (distance >= 1.5 && zombieState !== "chasing") {
      setZombieState("chasing")
    }

    // Handle zombie behavior based on state
    if (zombieState === "chasing") {
      // Move towards player
      const direction = new THREE.Vector3(playerPosition.x - zombiePosition.x, 0, playerPosition.z - zombiePosition.z)
        .normalize()
        .multiplyScalar(zombie.speed)

      zombieRef.current.setLinvel({
        x: direction.x,
        y: zombiePosition.y < 0.5 ? 5 : 0,
        z: direction.z,
      })
    } else if (zombieState === "attacking") {
      // Attack player
      const now = Date.now()
      if (now - lastAttackTime > 1000) {
        // Attack once per second
        decreasePlayerHealth(zombie.damage)
        setLastAttackTime(now)
      }
    }
  })

  return (
    <RigidBody
      ref={zombieRef}
      position={zombie.position}
      enabledRotations={[false, true, false]}
      colliders={false}
      mass={1}
      type="dynamic"
    >
      <CuboidCollider args={[0.4, 0.9, 0.4]} position={[0, 0, 0]} />

      {/* Zombie model - using simple shapes for demo */}
      <group position={[0, 0, 0]}>
        {/* Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.8, 0.4]} />
          <meshStandardMaterial color={hitFlash ? "#ff0000" : "#2a623d"} roughness={0.8} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={hitFlash ? "#ff0000" : "#2a623d"} roughness={0.8} />
        </mesh>

        {/* Arms */}
        <mesh position={[0.6, 0.2, 0]} castShadow>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color={hitFlash ? "#ff0000" : "#2a623d"} roughness={0.8} />
        </mesh>
        <mesh position={[-0.6, 0.2, 0]} castShadow>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color={hitFlash ? "#ff0000" : "#2a623d"} roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.15, 1.1, 0.26]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.15, 1.1, 0.26]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </RigidBody>
  )
}
