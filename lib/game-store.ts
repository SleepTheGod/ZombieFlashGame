import { create } from "zustand"

type GameState = "menu" | "playing" | "gameover"

type Zombie = {
  id: string
  position: [number, number, number]
  health: number
  speed: number
  damage: number
}

type GameStore = {
  gameState: GameState
  playerHealth: number
  ammo: number
  score: number
  zombiesKilled: number
  wave: number
  zombies: Zombie[]
  playerSkin: string
  selectedWeapon: string
  selectedMap: string

  startGame: () => void
  restartGame: () => void
  returnToMenu: () => void
  decreasePlayerHealth: (amount: number) => void
  decreaseAmmo: () => void
  reloadWeapon: () => void
  increaseScore: (amount: number) => void
  increaseZombiesKilled: () => void
  incrementWave: () => void
  addZombie: (zombie: Zombie) => void
  removeZombie: (id: string) => void
  setPlayerSkin: (skin: string) => void
  setSelectedWeapon: (weapon: string) => void
  setSelectedMap: (map: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: "menu",
  playerHealth: 100,
  ammo: 12, // Default for pistol
  score: 0,
  zombiesKilled: 0,
  wave: 0,
  zombies: [],
  playerSkin: "survivor",
  selectedWeapon: "pistol",
  selectedMap: "warehouse",

  startGame: () =>
    set((state) => {
      // Set initial ammo based on weapon
      const initialAmmo = state.selectedWeapon === "pistol" ? 12 : state.selectedWeapon === "shotgun" ? 8 : 30 // rifle

      return {
        gameState: "playing",
        playerHealth: 100,
        ammo: initialAmmo,
        score: 0,
        zombiesKilled: 0,
        wave: 1,
        zombies: [],
      }
    }),

  restartGame: () =>
    set((state) => {
      // Set initial ammo based on weapon
      const initialAmmo = state.selectedWeapon === "pistol" ? 12 : state.selectedWeapon === "shotgun" ? 8 : 30 // rifle

      return {
        gameState: "playing",
        playerHealth: 100,
        ammo: initialAmmo,
        score: 0,
        zombiesKilled: 0,
        wave: 1,
        zombies: [],
      }
    }),

  returnToMenu: () => set({ gameState: "menu" }),

  decreasePlayerHealth: (amount) =>
    set((state) => {
      const newHealth = Math.max(0, state.playerHealth - amount)

      if (newHealth === 0 && state.gameState === "playing") {
        return { playerHealth: newHealth, gameState: "gameover" }
      }

      return { playerHealth: newHealth }
    }),

  decreaseAmmo: () => set((state) => ({ ammo: Math.max(0, state.ammo - 1) })),

  reloadWeapon: () =>
    set((state) => {
      const maxAmmo = state.selectedWeapon === "pistol" ? 12 : state.selectedWeapon === "shotgun" ? 8 : 30 // rifle

      return { ammo: maxAmmo }
    }),

  increaseScore: (amount) => set((state) => ({ score: state.score + amount })),

  increaseZombiesKilled: () => set((state) => ({ zombiesKilled: state.zombiesKilled + 1 })),

  incrementWave: () => set((state) => ({ wave: state.wave + 1 })),

  addZombie: (zombie) =>
    set((state) => ({
      zombies: [...state.zombies, zombie],
    })),

  removeZombie: (id) =>
    set((state) => ({
      zombies: state.zombies.filter((zombie) => zombie.id !== id),
    })),

  setPlayerSkin: (skin) => set({ playerSkin: skin }),

  setSelectedWeapon: (weapon) =>
    set((state) => {
      const initialAmmo = weapon === "pistol" ? 12 : weapon === "shotgun" ? 8 : 30 // rifle

      return {
        selectedWeapon: weapon,
        ammo: initialAmmo,
      }
    }),

  setSelectedMap: (map) => set({ selectedMap: map }),
}))
