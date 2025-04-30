"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

export function Weapon({ type, isShooting }) {
  const weaponRef = useRef()
  const [recoil, setRecoil] = useState(0)
  const [muzzleFlash, setMuzzleFlash] = useState(false)

  const { camera } = useThree()

  // Handle shooting animation
  useEffect(() => {
    if (isShooting) {
      setRecoil(type === "shotgun" ? 0.2 : 0.1)
      setMuzzleFlash(true)

      setTimeout(() => {
        setMuzzleFlash(false)
      }, 50)

      setTimeout(() => {
        setRecoil(0)
      }, 100)
    }
  }, [isShooting, type])

  useFrame((state, delta) => {
    if (!weaponRef.current) return

    // Position weapon in front of camera
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)

    const weaponPosition = camera.position.clone()
    weaponPosition.add(cameraDirection.multiplyScalar(0.5 - recoil))

    // Adjust position based on weapon type
    if (type === "pistol") {
      weaponPosition.y -= 0.2
      weaponPosition.x += 0.2
    } else if (type === "shotgun") {
      weaponPosition.y -= 0.15
    } else {
      // rifle
      weaponPosition.y -= 0.1
    }

    weaponRef.current.position.copy(weaponPosition)
    weaponRef.current.rotation.copy(camera.rotation)
  })

  return (
    <group ref={weaponRef}>
      {type === "pistol" && (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.15, 0.3]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.1, 0.1]}>
            <boxGeometry args={[0.08, 0.2, 0.1]} />
            <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
          </mesh>
          {muzzleFlash && <pointLight position={[0, 0, 0.2]} intensity={5} color="#ff9500" distance={2} />}
        </group>
      )}

      {type === "shotgun" && (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.1, 0.6]} />
            <meshStandardMaterial color="#5c3c10" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.1, 0.1]}>
            <boxGeometry args={[0.08, 0.2, 0.1]} />
            <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
          </mesh>
          {muzzleFlash && <pointLight position={[0, 0, 0.4]} intensity={8} color="#ff9500" distance={3} />}
        </group>
      )}

      {type === "rifle" && (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.08, 0.7]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.08, 0]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.06, 0.15, 0.3]} />
            <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
          </mesh>
          {muzzleFlash && <pointLight position={[0, 0, 0.4]} intensity={6} color="#ff9500" distance={2.5} />}
        </group>
      )}
    </group>
  )
}
