"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skull } from "lucide-react"

export function GameMenu() {
  const startGame = useGameStore((state) => state.startGame)
  const setPlayerSkin = useGameStore((state) => state.setPlayerSkin)
  const setSelectedWeapon = useGameStore((state) => state.setSelectedWeapon)
  const setSelectedMap = useGameStore((state) => state.setSelectedMap)

  const [selectedTab, setSelectedTab] = useState("play")

  const handleStartGame = () => {
    startGame()
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="w-full max-w-3xl p-8 bg-zinc-900 rounded-lg shadow-2xl border border-red-800">
        <div className="flex items-center justify-center mb-6">
          <Skull className="w-10 h-10 text-red-600 mr-3" />
          <h1 className="text-4xl font-bold text-white">
            ZOMBIE <span className="text-red-600">SURVIVAL</span>
          </h1>
        </div>

        <Tabs defaultValue="play" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="play">Play</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="play" className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Select Map</h2>
              <div className="grid grid-cols-2 gap-4">
                {["warehouse", "forest", "city"].map((map) => (
                  <div
                    key={map}
                    className="relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:border-red-600"
                    onClick={() => setSelectedMap(map)}
                  >
                    <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                      <img
                        src={`/abstract-geometric-shapes.png?height=200&width=300&query=${map} zombie apocalypse scene`}
                        alt={map}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all">
                      <span className="text-xl font-bold text-white capitalize">{map}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-xl"
                onClick={handleStartGame}
              >
                Start Game
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Player Skin</h2>
              <Select onValueChange={setPlayerSkin} defaultValue="survivor">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select skin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="survivor">Survivor</SelectItem>
                  <SelectItem value="soldier">Soldier</SelectItem>
                  <SelectItem value="scientist">Scientist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Starting Weapon</h2>
              <div className="grid grid-cols-3 gap-4">
                {["pistol", "shotgun", "rifle"].map((weapon) => (
                  <div
                    key={weapon}
                    className="cursor-pointer p-4 rounded-lg border border-zinc-700 hover:border-red-600 transition-all"
                    onClick={() => setSelectedWeapon(weapon)}
                  >
                    <div className="aspect-square bg-zinc-800 rounded-md mb-2 flex items-center justify-center">
                      <img
                        src={`/abstract-geometric-shapes.png?height=100&width=100&query=${weapon} weapon`}
                        alt={weapon}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <p className="text-center text-white capitalize">{weapon}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={() => setSelectedTab("play")} className="bg-zinc-700 hover:bg-zinc-600">
                Back to Play
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="space-y-6">
            <div className="bg-zinc-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Controls</h2>
              <ul className="space-y-2 text-zinc-300">
                <li>
                  <span className="font-bold">WASD</span> - Move
                </li>
                <li>
                  <span className="font-bold">Mouse</span> - Look around
                </li>
                <li>
                  <span className="font-bold">Left Click</span> - Shoot
                </li>
                <li>
                  <span className="font-bold">R</span> - Reload
                </li>
                <li>
                  <span className="font-bold">Shift</span> - Run
                </li>
                <li>
                  <span className="font-bold">Space</span> - Jump
                </li>
                <li>
                  <span className="font-bold">ESC</span> - Pause
                </li>
              </ul>
            </div>

            <div className="bg-zinc-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Objective</h2>
              <p className="text-zinc-300">
                Survive as long as possible against waves of zombies. Collect ammo and health packs to stay alive. The
                difficulty increases with each wave. How long can you survive?
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={() => setSelectedTab("play")} className="bg-zinc-700 hover:bg-zinc-600">
                Back to Play
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
