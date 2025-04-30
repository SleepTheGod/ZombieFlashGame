"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import * as THREE from "three"
import { useGameStore } from "@/lib/game-store"
import { Weapon } from "./weapon"

export function Player() {
  const playerRef = useRef()
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 1.6, 0))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
  const [shootingCooldown, setShootingCooldown] = useState(false)

  const { camera } = useThree()
  const [, getKeys] = useKeyboardControls()

  const playerHealth = useGameStore((state) => state.playerHealth)
  const decreasePlayerHealth = useGameStore((state) => state.decreasePlayerHealth)
  const gameState = useGameStore((state) => state.gameState)
  const selectedWeapon = useGameStore((state) => state.selectedWeapon)
  const ammo = useGameStore((state) => state.ammo)
  const decreaseAmmo = useGameStore((state) => state.decreaseAmmo)
  const reloadWeapon = useGameStore((state) => state.reloadWeapon)
  const playerSkin = useGameStore((state) => state.playerSkin)

  // Handle shooting
  useEffect(() => {
    const handleShoot = () => {
      if (gameState !== "playing" || shootingCooldown || ammo <= 0) return

      decreaseAmmo()

      // Set cooldown based on weapon type
      setShootingCooldown(true)
      const cooldownTime = selectedWeapon === "pistol" ? 400 : selectedWeapon === "shotgun" ? 800 : 150 // rifle

      setTimeout(() => {
        setShootingCooldown(false)
      }, cooldownTime)

      // Raycast to detect zombie hits
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(), camera)

      // This would normally check for intersections with zombie meshes
      // For this demo, we'll simulate hits based on direction
    }

    const handleReload = () => {
      if (gameState !== "playing") return
      reloadWeapon()
    }

    window.addEventListener("mousedown", handleShoot)
    window.addEventListener("keydown", (e) => {
      if (e.key === "r" || e.key === "R") handleReload()
    })

    return () => {
      window.removeEventListener("mousedown", handleShoot)
      window.removeEventListener("keydown", handleReload)
    }
  }, [gameState, shootingCooldown, ammo, selectedWeapon, camera, decreaseAmmo, reloadWeapon])

  useFrame((state, delta) => {
    if (!playerRef.current || gameState !== "playing") return

    const { forward, backward, left, right, jump, run } = getKeys()

    // Get player position
    const position = playerRef.current.translation()

    // Calculate movement direction from camera
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0))
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(run ? 5 : 3)
      .applyEuler(camera.rotation)

    // Apply movement
    playerRef.current.setLinvel({ x: direction.x, y: position.y < 0.5 ? 5 : 0, z: direction.z })

    // Update camera position
    const cameraPosition = new THREE.Vector3(position.x, position.y + 1.6, position.z)
    const cameraTarget = new THREE.Vector3(position.x, position.y + 1.6, position.z)
    cameraTarget.add(state.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(5))

    // Smooth camera movement
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
  })

  return (
    <>
      <RigidBody
        ref={playerRef}
        position={[0, 2, 0]}
        enabledRotations={[false, false, false]}
        colliders={false}
        mass={1}
        type="dynamic"
        lockRotations
      >
        <CuboidCollider args={[0.3, 0.8, 0.3]} position={[0, 0, 0]} />

        {/* Player model would go here - using a simple box for now */}
        <mesh visible={false}>
          <boxGeometry args={[0.6, 1.6, 0.6]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>

      <Weapon type={selectedWeapon} isShooting={shootingCooldown} />
    </>
  )
}
