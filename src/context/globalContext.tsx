import { STORAGE } from '@/constants/storage'
import useLocalStorage from '@/hooks/useLocalStorage'
import React, { createContext, useContext, Dispatch, SetStateAction, useState, useEffect } from 'react'

export type Toast = {
  isOpen: boolean
  message: string
  type?: 'success' | 'error' | 'warning'
}

type ContextValue = {
  page: number
  toast: Toast
  setPage: Dispatch<SetStateAction<number>>
  setToast: Dispatch<SetStateAction<Toast>>
  removeCollection: () => void
  removePage: () => void
}

const defaultValue: ContextValue = {
  page: 1,
  toast: { isOpen: false, message: '', type: 'success' },
  setPage: () => {},
  setToast: () => {},
  removeCollection: () => {},
  removePage: () => {},
}

const Context = createContext<ContextValue>(defaultValue)
Context.displayName = 'GlobalContext'

type GlobalProviderProps = {
  children: React.ReactNode
  value?: any
}

export default function GlobalProvider(props: GlobalProviderProps) {
  const { children, value } = props
  const [toast, setToast] = useState<Toast>({ isOpen: false, message: '', type: 'success' })

  const [page, setPage, removePage] = useLocalStorage<number>(STORAGE.PAGE, 1)

  useEffect(() => {
    const FIVE_SECONDS = 5000

    if (toast.isOpen) {
      const timer = setTimeout(() => {
        setToast({ ...toast, isOpen: false })
      }, FIVE_SECONDS)

      return () => clearTimeout(timer)
    }
  }, [toast])

  const contextValue = {
    ...value,
    page,
    toast,
    setPage,
    setToast,
    removePage,
  }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

function useGlobalContext() {
  return useContext(Context)
}

export { GlobalProvider, useGlobalContext }
