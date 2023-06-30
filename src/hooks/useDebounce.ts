import { useState, useEffect } from 'react'

function useDebounce(value: any, delayInSeconds?: number) {
  const FIVE_SECONDS = 5000
  const delay = delayInSeconds || FIVE_SECONDS
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
