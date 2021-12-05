import { useState, useLayoutEffect } from 'react'

const useNodeWidth = ref => {
  const [width, setWidth] = useState(0)

  const handleResize = (entries: ResizeObserverEntry[]) => {
    if (!Array.isArray(entries)) {
      return
    }

    const entry = entries[0]
    setWidth(entry.contentRect.width)
  }

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const RO = new ResizeObserver(handleResize)
    RO.observe(ref.current)

    return () => {
      RO.disconnect()
    }
  }, [ref])

  return width
}

export default useNodeWidth