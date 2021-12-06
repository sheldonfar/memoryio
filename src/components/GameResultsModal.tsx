import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { Button, Grid, Modal, Typography, Theme, ModalProps } from '@mui/material'
import { GameSettings } from '../hooks/useGameSettings'

const useStyles = makeStyles((theme: Theme) => ({
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
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
  infoContainerActive: {
    backgroundColor: '#152938',
    color: 'white',
  },
}), { name: 'GameResultsModal' })

interface GameResultModalProps extends Omit<ModalProps, 'children'> {
  gameSettings: GameSettings;
  elapsedTime: string;
  moveCount: number;
  scores: number[];
  handleRestart: Function,
  handleNewGame: Function,
}

const GameResultsModal = ({
  elapsedTime,
  moveCount,
  gameSettings,
  scores,
  handleRestart,
  handleNewGame,
  ...rest
}: GameResultModalProps) => {
  const classes = useStyles()

  const sortedScore = scores
    .map((value, idx) => ({ player: idx + 1, value }))
    .sort((a, b) => b.value - a.value)

  const winners = sortedScore
    .filter(score => score.value === sortedScore[0].value)
    .map(({ player }) => player)

  const { playerCount } = gameSettings.value
  const isSinglePlayer = playerCount === 1
  const isMultiWinner = winners.length > 1

  return (
    <Modal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      {...rest}
    >
      <Grid container item className={classes.modalContainer} direction="column">
        <Typography component="h2" id="modal-modal-title" variant="h6">
          {isSinglePlayer 
            ? 'You did it!' 
            : isMultiWinner
              ? 'It\'s a tie!'
              : `Player ${sortedScore[0].player} wins!`
          }
        </Typography>
        <Typography id="modal-modal-description" mt={2}>
          {`Game over! ${isSinglePlayer ? 'Here\'s how you got on' : 'Here are  the results'}...`}
        </Typography>
        {isSinglePlayer
          ? (
            <>
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
                <Typography color="inherit">Time Elapsed</Typography>
                <Typography color="inherit">{elapsedTime}</Typography>
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
                <Typography color="inherit">Moves Taken</Typography>
                <Typography color="inherit">{moveCount}</Typography>
              </Grid>
            </>
          )
          : sortedScore.map(score => {
            const isWinner = winners.includes(score.player)
            return (
              <Grid 
                container
                item 
                className={`${classes.infoContainer} ${isWinner ? classes.infoContainerActive : ''}`} 
                justifyContent="space-between" 
                key={score.player} 
                mt={2}
                px={2} 
                py={1} 
                wrap="nowrap"
              >
                <Typography color="inherit">
                  Player {score.player}
                  {isWinner && ' (Winner!)'}
                </Typography>
                <Typography color="inherit">{score.value} points</Typography>
              </Grid>
            )
          })
        }
        <Grid container item columnSpacing={2} justifyContent="space-between" mt={2} width="auto">
          <Grid item>
            <Button variant="contained" onClick={() => handleRestart()}>Restart</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => handleNewGame}>New Game</Button>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default GameResultsModal