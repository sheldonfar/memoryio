import { useRef, useState } from 'react'

export const useTimer = () => {
  const [value, setValue] = useState('0:00')
  const dataRef = useRef<{ intervalHandle?: NodeJS.Timeout; tickCount: number }>({
    tickCount: 0,
  })

  return {
    value,
    start: () => {
      dataRef.current.intervalHandle = setInterval(() => {
        dataRef.current.tickCount++
        const seconds = `${dataRef.current.tickCount % 60}`.padStart(2, '0')
        const minutes = Math.floor(dataRef.current.tickCount / 60)
        setValue(`${minutes}:${seconds}`)
      }, 1000)
    },
    stop: () => {
      if (dataRef.current.intervalHandle) {
        clearInterval(dataRef.current.intervalHandle)
      }
      dataRef.current.intervalHandle = undefined
    },
    reset: () => {
      dataRef.current.tickCount = 0
      setValue('0:00')
    },
  }
}