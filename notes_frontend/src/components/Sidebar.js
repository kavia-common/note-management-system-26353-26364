/**
 * Sidebar list of notes with search and create actions.
 */
// PUBLIC_INTERFACE
import React from 'react';

function Sidebar({ notes, activeId, onSelect, onCreate, search, onSearchChange }) {
  /** Renders notes list and create button */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-search flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="2" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
          />
        </div>
        <button className="btn secondary" onClick={onCreate} aria-label="New note">New</button>
      </div>
      <div className="notes-list" role="list">
        {notes.length === 0 ? (
          <div style={{ padding: 16, color: '#6b7280' }}>No notes yet.</div>
        ) : notes.map((n) => (
          <div
            key={n.id}
            className={`note-item ${activeId === n.id ? 'active' : ''}`}
            role="listitem"
            onClick={() => onSelect(n)}
          >
            <div>
              <div className="note-title">{n.title || 'Untitled'}</div>
              <div className="note-meta">
                {n.updated_at ? new Date(n.updated_at).toLocaleString() : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
