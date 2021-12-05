import { useEffect, useRef } from 'react'

const createScheduling = (func, clearFunc) => (callback, delay) => {
  const savedCallback = useRef<Function>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = func(() => {
        if (savedCallback.current) {
          savedCallback.current()
        }
      }, delay)
      return () => clearFunc(id)
    }
    return undefined
  }, [delay])
}

export const useInterval = createScheduling(setInterval, clearInterval)
export const useTimeout = createScheduling(setTimeout, clearTimeout)
