import { useState } from 'react'

export enum Theme {
  Numbers = 'Numbers',
  Icons = 'Icons',
}

export type GridSize = [number, number]
export const GridSizes: GridSize[] = [[4, 4], [6, 6]]

export const PlayerCounts: number[] = [1, 2, 3, 4]
export interface Settings {
  theme: Theme
  gridSize: GridSize
  playerCount: number
}
export interface GameSettings {
  value: Settings
  setTheme: (theme: Theme) => void
  setGridSize: (gridSize: GridSize) => void
  setPlayerCount: (playerCount: number) => void
  save: () => void
  load: () => void
}

const initialSettings: Settings = {
  theme: Theme.Icons,
  gridSize: [4, 4],
  playerCount: 1,
}

const useGameSettings = (): GameSettings => {
  const [settings, setSettings] = useState(initialSettings)

  return {
    value: settings,
    setGridSize: gridSize => setSettings({ ...settings, gridSize }),
    setPlayerCount: playerCount => setSettings({ ...settings, playerCount }),
    setTheme: theme => setSettings({ ...settings, theme }),
    save: () => {
      localStorage.setItem('GameSettings', JSON.stringify(settings))
    },
    load: () => {
      const serializedSettings = localStorage.getItem('GameSettings')

      if (!serializedSettings) {
        return
      }

      const parsedSettings = JSON.parse(serializedSettings)

      if (parsedSettings) {
        setSettings(parsedSettings)
      }
    },
  }
}

export default useGameSettings
