import React, { ReactNode } from 'react'

import { GameSettings, Theme } from '../hooks/useGameSettings'
import TileIcons from '../components/TileIcons'
import { shuffle } from '.'

export interface Tile {
  id: string,
  index: number;
  content: ReactNode
}

const generateNumbers = (count: number) => Array.from(Array(count)).map((_, index) => ({
  id: index.toString(),
  content: index,
}))

const generateIcons = (count: number) => TileIcons.slice(0, count).map((Icon, index) => ({
  id: index.toString(),
  content: <Icon fontSize="inherit" />,
}))

const themeGenerators = {
  [Theme.Numbers]: generateNumbers,
  [Theme.Icons]: generateIcons,
}

export const generateTiles = (gameSettings: GameSettings): Tile[] => {
  const { gridSize, theme } = gameSettings.value
  const uniqCount = (gridSize[0] * gridSize[1]) / 2

  const items = themeGenerators[theme](uniqCount)
  const shuffledItems = shuffle([...items, ...items])

  return shuffledItems.map((item, index) => ({
    ...item,
    index,
  }))
}

export const tilesMatch = (tileOne?:  Tile, tileTwo?: Tile): boolean => tileOne?.id === tileTwo?.id

export const tilesEqual = (tileOne?: Tile, tileTwo?: Tile): boolean => {
  const indexesEqual = tileOne?.index === tileTwo?.index

  return tilesMatch(tileOne, tileTwo) && indexesEqual
}

