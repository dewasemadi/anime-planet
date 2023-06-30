import { useState, useEffect, Dispatch, SetStateAction } from 'react'

type StorageValue<T> = [T, Dispatch<SetStateAction<T>>, () => void]

function useLocalStorage<T>(key: string, initialValue: T): StorageValue<T> {
  const generateValue = () => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : initialValue
  }

  const [value, setValue] = useState<T>(generateValue())

  const remove = () => setValue(initialValue)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue, remove]
}

export default useLocalStorage
