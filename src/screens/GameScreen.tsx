import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles'
import { Grid, Typography, Button } from '@mui/material'

import { GameSettings } from '../hooks/useGameSettings'
import { useTimeout } from '../hooks/timers'
import useTimer from '../hooks/useTimer'
import useNodeWidth from '../hooks/useNodeWidth'
import { splitEvery } from '../utils'
import { generateTiles, Tile, tilesEqual, tilesMatch } from '../utils/tileUtils'
import GameResultsModal from '../components/GameResultsModal'

const useStyles = makeStyles(() => ({
  root: {
    margin: '0 auto',
    maxWidth: 1200,
  },
  tile: {
    borderRadius: '50%',
    backgroundColor: '#304859',
    color: 'white',
    fontSize: 70,
    cursor: 'pointer',
    transition: 'all 185ms ease-in-out',
  },
  tileSelected: {
    backgroundColor: '#fda214',
  },
  tileGuessed: {
    backgroundColor: '#bcced9',
  },
  infoContainer: {
    fontSize: 20,
    fontWeight: 700,
    color: '#304859',
    borderRadius: 5,
    backgroundColor: '#dfe7ec',
  },
  infoContainerActive: {
    backgroundColor: '#fda214',
    color: 'white',
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

  const { gridSize, playerCount } = gameSettings.value

  const [firstSelectedTile, setFirstSelectedTile] = useState()
  const [secondSelectedTile, setSecondSelectedTile] = useState()
  const [guessedTiles, setGuessedTiles] = useState<Tile[]>([])
  const [tiles, setTiles] = useState(generateTiles(gameSettings))
  const [gameStarted, setGameStarted] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [winModalOpen, setWinModalOpen] = useState(false)
  const [scores, setScores] = useState(Array(playerCount).fill(0))
  const [turn, setTurn] = useState(0)

  const containerWidth = useNodeWidth(containerRef)
  const timer = useTimer()

  const rows = splitEvery(gridSize[0], tiles)
  const isSinglePlayer = playerCount === 1

  useTimeout(() => {
    if (secondSelectedTile) {
      setTurn(turn === playerCount - 1 ? 0 : turn + 1)
      setFirstSelectedTile(undefined)
      setSecondSelectedTile(undefined)
    }
  }, secondSelectedTile ? 500 : null)

  useEffect(() => {
    // game won
    if (guessedTiles.length === tiles.length) {
      timer.stop()
      setWinModalOpen(true)
    }
  }, [guessedTiles.length])

  const handleRestart = () => {
    timer.reset()
    setWinModalOpen(false)
    setFirstSelectedTile(undefined)
    setSecondSelectedTile(undefined)
    setTiles(generateTiles(gameSettings))
    setGuessedTiles([])
    setGameStarted(false)
    setMoveCount(0)
  }

  const handleNewGame = () => {
    setWinModalOpen(false)
    navigate('/')
  }

  const handleSelect = tile => {
    if (secondSelectedTile) {
      // you are clicking too fast my boy
      return
    }

    setMoveCount(moveCount + 1)

    if (!gameStarted) {
      setGameStarted(true)
      timer.start()
    }

    if (firstSelectedTile) {
      if (tilesMatch(firstSelectedTile, tile)) {
        const newScores = [...scores]
        newScores[turn] = scores[turn] + 1

        setScores(newScores)
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
    <>
      <Grid container item alignItems="center" className={classes.root} direction="column" justifyContent="center" p={3}>
        <Grid container item direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" wrap="nowrap">
          <Grid item>
            <Typography>MemoryIO</Typography>
          </Grid>
          <Grid container item columnSpacing={2} width="auto">
            <Grid item>
              <Button variant="contained" onClick={handleRestart}>Restart</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleNewGame}>New Game</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="column" maxWidth="700px" mt={2} ref={containerRef} rowSpacing={2}>
          {rows.map((row, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
            <Grid container item columnSpacing={2} key={rowIndex} wrap="nowrap">
              {row.map((tile, index) => {
                const size = (containerWidth / gridSize[1] - 16)
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
                      onClick={() => {
                        if (!selected) {
                          handleSelect(tile)
                        }
                      }}
                    >
                      {(selected || guessed) && tile.content}
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          ))}
          <Grid container item justifyContent="space-between" mt={2} wrap="nowrap">
            {isSinglePlayer
              ? (
                <>
                  <Grid container item className={classes.infoContainer} direction="column" px={6} py={1} width="auto">
                    <Typography align="center" variant="body2">Time</Typography>
                    <Typography align="center" variant="body1">{timer.value}</Typography>
                  </Grid>
                  <Grid container item className={classes.infoContainer} direction="column" px={6} py={1} width="auto">
                    <Typography align="center" variant="body2">Moves</Typography>
                    <Typography align="center" variant="body1">{moveCount}</Typography>
                  </Grid>
                </>
              )
              : scores.map((_, i) => {
                const active = i === turn
                return (
                  <Grid 
                    container 
                    item
                    className={`${classes.infoContainer} ${active ? classes.infoContainerActive : ''}`} 
                    direction="column" 
                    key={i} 
                    px={6}
                    py={1}
                    width="auto"
                  >
                    <Typography align="center" color="inherit" variant="body2">Player {i + 1}</Typography>
                    <Typography align="center" color="inherit" variant="body1">{scores[i]}</Typography>
                  </Grid>
                )
              })
            }
          </Grid>
        </Grid>
      </Grid>
      <GameResultsModal
        elapsedTime={timer.value}
        gameSettings={gameSettings}
        handleNewGame={handleNewGame}
        handleRestart={handleRestart}
        moveCount={moveCount}
        open={winModalOpen}
        scores={scores}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            setWinModalOpen(false)
          }
        }}
      />
    </>
  )
}

export default GameScreen
