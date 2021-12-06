import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Typography, Button, Paper } from '@mui/material'

import { Theme, PlayerCounts, GridSizes, GameSettings } from '../hooks/useGameSettings'
import SettingsSection from '../components/SettingsSection'

interface GameSettingsScreenProps {
  gameSettings: GameSettings;
}

const GameSettingsScreen = ({
  gameSettings,
}: GameSettingsScreenProps) => {
  const navigate = useNavigate()

  const handleStart = () => {
    gameSettings.save()
    navigate('/game')
  }

  return (
    <Grid container item alignItems="center" direction="column" justifyContent="center" p={3}>
      <Typography mb={2}>MemoryIO</Typography>
      <Paper elevation={3}>
        <Grid container item direction="column" p={2} rowSpacing={2}>
          <SettingsSection
            selectedValue={gameSettings.value.theme}
            title="Select theme"
            values={Object.values(Theme)}
            onSelect={value => gameSettings.setTheme(value)}
          />
          <SettingsSection
            selectedValue={gameSettings.value.playerCount}
            title="Number of players"
            values={PlayerCounts}
            onSelect={value => gameSettings.setPlayerCount(value)}
          />
          <SettingsSection
            selectedValue={gameSettings.value.gridSize}
            title="Grid size"
            values={GridSizes}
            onSelect={value => gameSettings.setGridSize(value)}
          />
          <Grid item>
            <Button variant="contained" onClick={handleStart}>Start</Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default GameSettingsScreen
