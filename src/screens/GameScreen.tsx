import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles'
import { Grid, Typography, Button, Modal, Theme } from '@mui/material'

import { GameSettings } from '../hooks/useGameSettings'
import { useTimeout } from '../hooks/timers'
import useTimer from '../hooks/useTimer'
import useNodeWidth from '../hooks/useNodeWidth'
import { splitEvery } from '../utils'
import { generateTiles, Tile, tilesEqual, tilesMatch } from '../utils/tileUtils'

const useStyles = makeStyles((theme: Theme) => ({
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
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#f2f2f2',
    border: '2px solid #000',
    padding: theme.spacing(4),
  },
  infoContainer: {
    fontSize: 20,
    fontWeight: 700,
    color: '#304859',
    borderRadius: 5,
    backgroundColor: '#dfe7ec',
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

  const [firstSelectedTile, setFirstSelectedTile] = useState()
  const [secondSelectedTile, setSecondSelectedTile] = useState()
  const [guessedTiles, setGuessedTiles] = useState<Tile[]>([])
  const [tiles, setTiles] = useState(generateTiles(gameSettings))
  const [gameStarted, setGameStarted] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [winModalOpen, setWinModalOpen] = useState(false)

  const containerWidth = useNodeWidth(containerRef)
  const timer = useTimer()

  const rows = splitEvery(gridSize[0], tiles)

  useTimeout(() => {
    if (secondSelectedTile) {
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
    setMoveCount(moveCount + 1)

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
            <Grid container item className={classes.infoContainer} direction="column" px={6} py={1} width="auto">
              <Typography align="center" variant="body2">Time</Typography>
              <Typography align="center" variant="body1">{timer.value}</Typography>
            </Grid>
            <Grid container item className={classes.infoContainer} direction="column" px={6} py={1} width="auto">
              <Typography align="center" variant="body2">Moves</Typography>
              <Typography align="center" variant="body1">{moveCount}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        aria-describedby="modal-modal-description"
        aria-labelledby="modal-modal-title"
        open={winModalOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setWinModalOpen(false)
          }
        }}
      >
        <Grid container item className={classes.modalContainer} direction="column">
          <Typography component="h2" id="modal-modal-title" variant="h6">
            You did it!
          </Typography>
          <Typography id="modal-modal-description" mt={2}>
            {'Game over! Here\'s how you got on...'}
          </Typography>

          <Grid 
            container 
            item 
            className={classes.infoContainer} 
            justifyContent="space-between" 
            mt={2}
            px={2} 
            py={1} 
            wrap="nowrap"
          >
            <Typography>Time Elapsed</Typography>
            <Typography>{timer.value}</Typography>
          </Grid>

          <Grid 
            container 
            item
            className={classes.infoContainer} 
            justifyContent="space-between"
            mt={2}
            px={2} 
            py={1}
            wrap="nowrap"
          >
            <Typography>Moves Taken</Typography>
            <Typography>{moveCount}</Typography>
          </Grid>

          <Grid container item columnSpacing={2} justifyContent="space-between" mt={2} width="auto">
            <Grid item>
              <Button variant="contained" onClick={handleRestart}>Restart</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleNewGame}>New Game</Button>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  )
}

export default GameScreen
