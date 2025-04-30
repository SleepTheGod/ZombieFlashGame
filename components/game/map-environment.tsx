"use client"

import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { Plane, Box } from "@react-three/drei"

export function MapEnvironment({ mapType = "warehouse" }) {
  // Create different environments based on map type
  if (mapType === "warehouse") {
    return <WarehouseMap />
  } else if (mapType === "forest") {
    return <ForestMap />
  } else if (mapType === "city") {
    return <CityMap />
  }

  // Default map
  return <WarehouseMap />
}

function WarehouseMap() {
  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
        <Plane args={[100, 100]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#333" roughness={0.8} />
        </Plane>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 5, 0.1]} position={[0, 5, 50]} />
        <CuboidCollider args={[50, 5, 0.1]} position={[0, 5, -50]} />
        <CuboidCollider args={[0.1, 5, 50]} position={[50, 5, 0]} />
        <CuboidCollider args={[0.1, 5, 50]} position={[-50, 5, 0]} />

        <Box args={[100, 10, 0.2]} position={[0, 5, 50]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[100, 10, 0.2]} position={[0, 5, -50]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[0.2, 10, 100]} position={[50, 5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[0.2, 10, 100]} position={[-50, 5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </RigidBody>

      {/* Obstacles */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[2, 1, 2]} position={[5, 1, 5]} />
        <Box args={[4, 2, 4]} position={[5, 1, 5]} castShadow receiveShadow>
          <meshStandardMaterial color="#444" roughness={0.8} />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1, 0.5, 3]} position={[-8, 0.5, -6]} />
        <Box args={[2, 1, 6]} position={[-8, 0.5, -6]} castShadow receiveShadow>
          <meshStandardMaterial color="#555" roughness={0.8} />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[3, 1.5, 1]} position={[0, 1.5, -15]} />
        <Box args={[6, 3, 2]} position={[0, 1.5, -15]} castShadow receiveShadow>
          <meshStandardMaterial color="#333" roughness={0.8} />
        </Box>
      </RigidBody>

      {/* Columns */}
      {[
        [-10, 0, -10],
        [10, 0, -10],
        [-10, 0, 10],
        [10, 0, 10],
      ].map((position, index) => (
        <RigidBody key={index} type="fixed" colliders={false}>
          <CuboidCollider args={[1, 3, 1]} position={[position[0], 3, position[2]]} />
          <Box args={[2, 6, 2]} position={[position[0], 3, position[2]]} castShadow receiveShadow>
            <meshStandardMaterial color="#444" roughness={0.8} />
          </Box>
        </RigidBody>
      ))}
    </>
  )
}

function ForestMap() {
  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
        <Plane args={[100, 100]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#2d4c1e" roughness={1} />
        </Plane>
      </RigidBody>

      {/* Trees */}
      {Array.from({ length: 30 }).map((_, index) => {
        const x = (Math.random() - 0.5) * 80
        const z = (Math.random() - 0.5) * 80
        const height = 5 + Math.random() * 5

        return (
          <RigidBody key={index} type="fixed" colliders={false}>
            <CuboidCollider args={[0.5, height / 2, 0.5]} position={[x, height / 2, z]} />

            {/* Tree trunk */}
            <Box args={[1, height, 1]} position={[x, height / 2, z]} castShadow receiveShadow>
              <meshStandardMaterial color="#5c3c10" roughness={0.8} />
            </Box>

            {/* Tree top */}
            <group position={[x, height * 0.8, z]}>
              <mesh castShadow>
                <coneGeometry args={[3, 5, 8]} />
                <meshStandardMaterial color="#1a3409" roughness={1} />
              </mesh>
            </group>
          </RigidBody>
        )
      })}

      {/* Rocks */}
      {Array.from({ length: 15 }).map((_, index) => {
        const x = (Math.random() - 0.5) * 60
        const z = (Math.random() - 0.5) * 60
        const scale = 0.5 + Math.random() * 1.5

        return (
          <RigidBody key={`rock-${index}`} type="fixed" colliders={false}>
            <CuboidCollider args={[scale, scale / 2, scale]} position={[x, scale / 2, z]} />
            <mesh position={[x, scale / 2, z]} castShadow receiveShadow>
              <dodecahedronGeometry args={[scale, 0]} />
              <meshStandardMaterial color="#555" roughness={0.9} />
            </mesh>
          </RigidBody>
        )
      })}
    </>
  )
}

function CityMap() {
  return (
    <>
      {/* Street */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
        <Plane args={[100, 100]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#333" roughness={0.8} />
        </Plane>
      </RigidBody>

      {/* Buildings */}
      {Array.from({ length: 12 }).map((_, index) => {
        const gridSize = 3
        const gridX = index % gridSize
        const gridZ = Math.floor(index / gridSize)

        const x = (gridX - 1) * 30
        const z = (gridZ - 1) * 30

        const width = 10 + Math.random() * 5
        const depth = 10 + Math.random() * 5
        const height = 10 + Math.random() * 20

        return (
          <RigidBody key={`building-${index}`} type="fixed" colliders={false}>
            <CuboidCollider args={[width / 2, height / 2, depth / 2]} position={[x, height / 2, z]} />
            <Box args={[width, height, depth]} position={[x, height / 2, z]} castShadow receiveShadow>
              <meshStandardMaterial color="#444" roughness={0.7} />
            </Box>

            {/* Windows */}
            {Array.from({ length: Math.floor(height / 3) }).map((_, floorIndex) => {
              return (
                <group key={`floor-${floorIndex}`} position={[0, floorIndex * 3 + 3, 0]}>
                  {Array.from({ length: 3 }).map((_, windowIndex) => (
                    <Box
                      key={`window-${floorIndex}-${windowIndex}`}
                      args={[1, 1.5, 0.1]}
                      position={[x - width / 2 + 2 + windowIndex * 3, floorIndex * 3 + 3, z + depth / 2 + 0.1]}
                      castShadow
                      receiveShadow
                    >
                      <meshStandardMaterial
                        color="#88ccff"
                        emissive="#88ccff"
                        emissiveIntensity={0.2}
                        roughness={0.3}
                      />
                    </Box>
                  ))}
                </group>
              )
            })}
          </RigidBody>
        )
      })}

      {/* Debris and obstacles */}
      {Array.from({ length: 20 }).map((_, index) => {
        const x = (Math.random() - 0.5) * 60
        const z = (Math.random() - 0.5) * 60
        const size = 0.5 + Math.random() * 1

        return (
          <RigidBody key={`debris-${index}`} type="fixed" colliders={false}>
            <CuboidCollider args={[size, size / 2, size]} position={[x, size / 2, z]} />
            <Box args={[size * 2, size, size * 2]} position={[x, size / 2, z]} castShadow receiveShadow>
              <meshStandardMaterial color="#555" roughness={0.9} />
            </Box>
          </RigidBody>
        )
      })}

      {/* Abandoned cars */}
      {Array.from({ length: 5 }).map((_, index) => {
        const x = (Math.random() - 0.5) * 40
        const z = (Math.random() - 0.5) * 40
        const rotation = Math.random() * Math.PI * 2

        return (
          <RigidBody key={`car-${index}`} type="fixed" colliders={false}>
            <CuboidCollider args={[2, 1, 4]} position={[x, 1, z]} rotation={[0, rotation, 0]} />
            <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
              {/* Car body */}
              <Box args={[4, 1.5, 8]} position={[0, 1, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#555" roughness={0.7} />
              </Box>
              {/* Car top */}
              <Box args={[3.5, 1, 4]} position={[0, 2.5, -1]} castShadow receiveShadow>
                <meshStandardMaterial color="#444" roughness={0.7} />
              </Box>
            </group>
          </RigidBody>
        )
      })}
    </>
  )
}
