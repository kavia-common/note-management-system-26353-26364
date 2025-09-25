import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import AuthForm from './components/AuthForm';
import { login, logout, getToken, getNotes, createNote, updateNote, deleteNote } from './services/api';

// PUBLIC_INTERFACE
function App() {
  /** Main app shell implementing auth, notes sidebar, and editor */
  const [auth, setAuth] = useState(!!getToken());
  const [authError, setAuthError] = useState('');
  const [notes, setNotes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load notes when authenticated
  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    getNotes()
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data?.items || []);
        setNotes(arr);
        setFiltered(arr);
        setSelected(arr[0] || null);
      })
      .catch((e) => {
        console.error('Failed to load notes', e);
      })
      .finally(() => setLoading(false));
  }, [auth]);

  // Filter notes by search
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(notes);
    } else {
      setFiltered(
        notes.filter(n =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q)
        )
      );
    }
  }, [search, notes]);

  const onLogin = async ({ email, password }) => {
    setAuthError('');
    try {
      await login({ email, password });
      setAuth(true);
    } catch (e) {
      setAuthError(e.message || 'Login failed');
    }
  };

  const onLogout = () => {
    logout();
    setAuth(false);
    setNotes([]);
    setFiltered([]);
    setSelected(null);
  };

  const handleCreate = async () => {
    // Create locally first for immediate UX, then persist
    const temp = { id: `temp-${Date.now()}`, title: 'Untitled', content: '', isNew: true, updated_at: new Date().toISOString() };
    setNotes([temp, ...notes]);
    setFiltered([temp, ...filtered]);
    setSelected(temp);
  };

  const handleSave = async (note) => {
    try {
      if (note.isNew) {
        const created = await createNote({ title: note.title || 'Untitled', content: note.content || '' });
        // replace temp with real
        const replace = (arr) => arr.map(n => (n.id === note.id ? created : n));
        setNotes(replace);
        setFiltered(replace);
        setSelected(created);
      } else {
        const updated = await updateNote(note.id, { title: note.title, content: note.content });
        const replace = (arr) => arr.map(n => (n.id === note.id ? updated : n));
        setNotes(replace);
        setFiltered(replace);
        setSelected(updated);
      }
    } catch (e) {
      alert(`Save failed: ${e.message}`);
    }
  };

  const handleDelete = async (note) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(note.id);
      const remove = (arr) => arr.filter(n => n.id !== note.id);
      const newNotes = remove(notes);
      setNotes(newNotes);
      setFiltered(remove(filtered));
      setSelected(newNotes[0] || null);
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  const isAuthenticated = useMemo(() => auth, [auth]);

  if (!isAuthenticated) {
    return (
      <div className="app-shell">
        <Navbar isAuthenticated={false} onLoginClick={()=>{}} onLogoutClick={onLogout} />
        <div style={{ padding: 16 }}>
          <AuthForm onSubmit={onLogin} error={authError} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar isAuthenticated={true} onLoginClick={()=>{}} onLogoutClick={onLogout} />
      <div className="main">
        <Sidebar
          notes={filtered}
          activeId={selected?.id}
          onSelect={setSelected}
          onCreate={handleCreate}
          search={search}
          onSearchChange={setSearch}
        />
        <div>
          {loading ? (
            <div className="editor">
              <div className="field">
                <div style={{ color: '#6b7280' }}>Loading notes...</div>
              </div>
            </div>
          ) : (
            <NoteEditor
              note={selected}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
