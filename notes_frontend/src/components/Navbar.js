/**
 * Navbar component for top navigation and auth controls.
 */
// PUBLIC_INTERFACE
import React from 'react';

function Navbar({ isAuthenticated, onLoginClick, onLogoutClick }) {
  /** Navbar with brand and auth action button */
  return (
    <div className="navbar">
      <div className="brand">
        <span className="dot" />
        <span>Ocean Notes</span>
      </div>
      <div className="nav-actions">
        {isAuthenticated ? (
          <button className="btn ghost" onClick={onLogoutClick} aria-label="Logout">
            Logout
          </button>
        ) : (
          <button className="btn" onClick={onLoginClick} aria-label="Login">
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
