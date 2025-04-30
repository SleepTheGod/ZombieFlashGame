export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-32 h-32 border-t-4 border-red-600 rounded-full animate-spin"></div>
      <h2 className="mt-6 text-2xl font-bold">Loading Zombie Survival...</h2>
      <p className="mt-2 text-gray-400">Prepare for the apocalypse</p>
    </div>
  )
}
