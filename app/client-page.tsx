"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import Loading from "./loading"

// Dynamically import the game component with no SSR
const Game = dynamic(() => import("@/components/game/game"), {
  ssr: false,
  loading: () => <Loading />,
})

export default function GameWrapper() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <Suspense fallback={<Loading />}>
        <Game />
      </Suspense>
    </main>
  )
}
