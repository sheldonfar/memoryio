import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles'
import { Grid, Typography, Button } from '@mui/material'

import { GameSettings } from '../hooks/useGameSettings'
import { splitEvery } from '../utils'
import { useTimeout } from '../utils/timers'
import { generateTiles, Tile, tilesEqual, tilesMatch } from '../utils/tileUtils'
import { useTimer } from '../hooks/useTimer'

const useStyles = makeStyles(() => ({
  root: {
    margin: '0 auto',
    maxWidth: 1200,
  },
  tile: {
    borderRadius: '50%',
    backgroundColor: '#304859',
    color: 'white',
    cursor: 'pointer',
  },
  tileSelected: {
    backgroundColor: '#fda214',
  },
  tileGuessed: {
    backgroundColor: '#bcced9',
  },
}), { name: 'GameScreen' })

interface GameScreenProps {
  gameSettings: GameSettings;
}

const GameScreen = ({
  gameSettings,
}: GameScreenProps) => {
  const classes = useStyles()
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)

  const { gridSize } = gameSettings.value

  const [containerWidth, setContainerWidth] = useState(0)
  const [firstSelectedTile, setFirstSelectedTile] = useState()
  const [secondSelectedTile, setSecondSelectedTile] = useState()
  const [guessedTiles, setGuessedTiles] = useState<Tile[]>([])
  const [tiles, setTiles] = useState(generateTiles(gameSettings))
  const [gameStarted, setGameStarted] = useState(false)

  const timer = useTimer()

  const rows = splitEvery(gridSize[0], tiles)

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [])

  useTimeout(() => {
    if (secondSelectedTile) {
      setFirstSelectedTile(undefined)
      setSecondSelectedTile(undefined)
    }
  }, secondSelectedTile ? 500 : null)

  useEffect(() => {
    if (guessedTiles.length === tiles.length) {
      timer.stop()
    }
  }, [guessedTiles.length])

  const handleRestart = () => {
    setFirstSelectedTile(undefined)
    setSecondSelectedTile(undefined)
    setTiles(generateTiles(gameSettings))
    setGuessedTiles([])
    setGameStarted(false)
  }

  const handleNewGame = () => {
    navigate('/')
  }

  const handleSelect = tile => {
    if (!gameStarted) {
      setGameStarted(true)
      timer.start()
    }

    if (firstSelectedTile) {
      if (tilesMatch(firstSelectedTile, tile)) {
        setGuessedTiles([...guessedTiles, firstSelectedTile, tile])
        setFirstSelectedTile(undefined)
      } else {
        setSecondSelectedTile(tile)
      }
    } else {
      setFirstSelectedTile(tile)
    }
  }

  return (
    <Grid container item alignItems="center" className={classes.root} direction="column" justifyContent="center" p={3}>
      <Grid container item justifyContent="space-between" wrap="nowrap">
        <Grid item>
          <Typography>MemoryIO</Typography>
        </Grid>
        <Grid container item columnSpacing={2} width="auto">
          <Grid item>
            <Button onClick={handleRestart}>Restart</Button>
          </Grid>
          <Grid item>
            <Button onClick={handleNewGame}>New Game</Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item direction="column" mt={2} ref={containerRef} rowSpacing={2} width="800px">
        {rows.map((row, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid container item columnSpacing={2} key={rowIndex} wrap="nowrap">
            {row.map((tile, index) => {
              const size = containerWidth / gridSize[1]
              const isFirstTile = tilesEqual(firstSelectedTile, tile)
              const isSecondTile = tilesEqual(secondSelectedTile, tile)
              const guessed = guessedTiles.some(guessedTile => tilesEqual(guessedTile, tile))
              const selected = isFirstTile || isSecondTile

              return (
                <Grid item xs key={`${tile.id}-${index}`}>
                  <Grid
                    container
                    item
                    alignItems="center"
                    className={`${classes.tile} ${selected ? classes.tileSelected : ''} ${guessed ? classes.tileGuessed : ''}`}
                    justifyContent="center"
                    style={{ width: size, height: size }}
                    onClick={() => handleSelect(tile)}
                  >
                    <Typography align="center">{tile.content}</Typography>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        ))}
      </Grid>
      <Grid container item justifyContent="space-between">
        <Grid item>
          <Typography>Time</Typography>
          <Typography>{timer.value}</Typography>
        </Grid>
        <Grid item>
          <Typography>Moves</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default GameScreen
