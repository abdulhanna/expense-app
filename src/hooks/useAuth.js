import { useEffect, useState, useCallback } from 'react'

const PIN_KEY = 'expense-pin-hash'
const SESSION_KEY = 'expense-session'

const hashPin = async (pin) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const useAuth = () => {
  const [hasPin, setHasPin] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedPin = localStorage.getItem(PIN_KEY)
    const session = sessionStorage.getItem(SESSION_KEY)
    setHasPin(Boolean(storedPin))
    setUnlocked(Boolean(session))
    setLoading(false)
  }, [])

  const setPin = useCallback(async (pin) => {
    setError(null)
    if (!/^[0-9]{4,6}$/.test(pin)) {
      setError('PIN must be 4-6 digits')
      return false
    }
    const hashed = await hashPin(pin)
    localStorage.setItem(PIN_KEY, hashed)
    sessionStorage.setItem(SESSION_KEY, 'true')
    setHasPin(true)
    setUnlocked(true)
    return true
  }, [])

  const unlock = useCallback(async (pin) => {
    setError(null)
    const stored = localStorage.getItem(PIN_KEY)
    if (!stored) {
      setError('No PIN set. Please create one.')
      return false
    }
    const hashed = await hashPin(pin)
    if (hashed === stored) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
      return true
    }
    setError('Incorrect PIN')
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }, [])

  return {
    hasPin,
    unlocked,
    loading,
    error,
    setPin,
    unlock,
    logout,
  }
}

export default useAuth
