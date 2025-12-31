import React, { useState } from 'react'

const PinLock = ({ hasPin, onSetPin, onUnlock, error }) => {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const handleSetPin = async (e) => {
    e.preventDefault()
    if (pin !== confirmPin) return alert('PINs do not match')
    await onSetPin(pin)
    setPin('')
    setConfirmPin('')
  }

  const handleUnlock = async (e) => {
    e.preventDefault()
    await onUnlock(pin)
    setPin('')
  }

  return (
    <div className="lock-screen">
      <div className="card lock-card">
        <h2>{hasPin ? 'Enter PIN' : 'Create PIN'}</h2>
        <p className="muted">{hasPin ? 'Secure your expenses' : 'Set a 4-6 digit passcode'}</p>
        <form onSubmit={hasPin ? handleUnlock : handleSetPin} className="form">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            minLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            required
          />
          {!hasPin && (
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              minLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm PIN"
              required
            />
          )}
          {error && <p className="error">{error}</p>}
          <button className="primary full" type="submit">
            {hasPin ? 'Unlock' : 'Set PIN'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PinLock
