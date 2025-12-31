import React from 'react'

const Navbar = ({ onToggleTheme, theme, isOnline, onLogout }) => {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-icon">💰</span>
        <span className="brand-text">PocketLedger</span>
      </div>
      <div className="navbar-actions">
        <div className={`status ${isOnline ? 'online' : 'offline'}`}>
          <span className="dot" />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <button className="ghost" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <button className="ghost" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
