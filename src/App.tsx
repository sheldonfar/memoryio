import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import { CircularProgress } from '@mui/material'
import GameSettingsScreen from './screens/GameSettingsScreen'
import GameScreen from './screens/GameScreen'
import useGameSettings from './hooks/useGameSettings'

const App = () => {
  const gameSettings = useGameSettings()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gameSettings.load()
    setLoading(false)
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Routes>
      <Route element={<GameSettingsScreen gameSettings={gameSettings} />} path="/" />
      <Route element={<GameScreen gameSettings={gameSettings} />} path="/game" />
    </Routes>
  )
}

export default App
