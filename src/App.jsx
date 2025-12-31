import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Summary from './components/Summary'
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import PinLock from './components/PinLock'
import useExpenses from './hooks/useExpenses'
import useAuth from './hooks/useAuth'
import './App.css'

function App() {
  const { expenses, loading, error, summary, addExpense, updateExpense, deleteExpense } = useExpenses()
  const { hasPin, unlocked, loading: authLoading, error: authError, setPin, unlock, logout } = useAuth()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateExpense(editing.id, data)
      } else {
        await addExpense(data)
      }
      setEditing(null)
      setFormOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (expense) => {
    setEditing(expense)
    setFormOpen(true)
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this entry?')
    if (confirmed) deleteExpense(id)
  }

  if (authLoading) {
    return <div className="loading">Loading...</div>
  }

  if (!unlocked) {
    return <PinLock hasPin={hasPin} onSetPin={setPin} onUnlock={unlock} error={authError} />
  }

  return (
    <div className="app">
      <Navbar onToggleTheme={toggleTheme} theme={theme} isOnline={isOnline} onLogout={logout} />
      <main className="container">
        {(error || authError) && <div className="banner error">Error: {error || authError}</div>}
        {!isOnline && <div className="banner info">You are offline. Changes are stored locally.</div>}
        <Summary summary={summary} />
        <section className="panel">
          <div className="panel-header">
            <h2>Recent Activity</h2>
            <button className="ghost" onClick={() => setFormOpen(true)}>
              Add Entry
            </button>
          </div>
          {loading ? <p>Loading...</p> : <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />}
        </section>
      </main>

      {formOpen && (
        <div className="overlay">
          <ExpenseForm
            editing={editing}
            onSave={handleSave}
            onClose={() => {
              setFormOpen(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      <button className="fab" onClick={() => setFormOpen(true)} aria-label="Add expense">
        +
      </button>
    </div>
  )
}

export default App
