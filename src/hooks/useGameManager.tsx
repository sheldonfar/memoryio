import { useEffect, useState } from 'react'

import { Tile } from '../utils/tileUtils'
import { GameSettings } from './useGameSettings'

export interface GameManager {
  gameStarted: boolean
  gameWon: boolean
  moveCount: number
  scores: number[]
  turn: number
  guessedTiles: Tile[]
  nextTurn: () => void
  reset: () => void
  performMove: () => void
  score: (tileOne: Tile, tileTwo: Tile) => void
}

const useGameManager = (gameSettings: GameSettings): GameManager => {
  const { playerCount, gridSize } = gameSettings.value

  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [scores, setScores] = useState(Array(playerCount).fill(0))
  const [turn, setTurn] = useState(0)
  const [guessedTiles, setGuessedTiles] = useState<Tile[]>([])

  useEffect(() => {
    const totalTiles = gridSize[0] * gridSize[1]

    if (guessedTiles.length === totalTiles) {
      setGameWon(true)
    }
  }, [guessedTiles.length])
  
  return {
    gameStarted,
    gameWon,
    moveCount,
    scores,
    turn,
    guessedTiles,

    nextTurn: () => {
      setTurn(turn === playerCount - 1 ? 0 : turn + 1)
    },

    reset: () => {
      setGameStarted(false)
      setMoveCount(0)
      setGuessedTiles([])
    },

    performMove: () => {
      setMoveCount(moveCount + 1)

      if (!gameStarted) {
        setGameStarted(true)
      }
    },

    score: (tileOne: Tile, tileTwo: Tile) => {
      const newScores = [...scores]
      newScores[turn] = scores[turn] + 1

      setScores(newScores)
      setGuessedTiles([...guessedTiles, tileOne, tileTwo])
    },
  }
}
  
export default useGameManager