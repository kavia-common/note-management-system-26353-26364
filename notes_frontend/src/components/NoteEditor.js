/**
 * Editor for the selected note.
 */
// PUBLIC_INTERFACE
import React, { useEffect, useState } from 'react';

function NoteEditor({ note, onSave, onDelete }) {
  /** Edit title and content, supports save and delete */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setDirty(false);
  }, [note?.id]);

  const handleSave = () => {
    onSave({ ...note, title, content });
    setDirty(false);
  };

  if (!note) {
    return (
      <div className="editor" aria-live="polite">
        <div className="field">
          <div style={{ color: '#6b7280' }}>Select or create a note to begin.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <strong style={{ color: 'var(--primary)' }}>Editing</strong>
        <span style={{ color: '#6b7280' }}>#{note.id || 'new'}</span>
      </div>
      <div className="field">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          className="input"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
          placeholder="Note title"
        />
      </div>
      <div className="field">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          className="textarea"
          value={content}
          onChange={(e) => { setContent(e.target.value); setDirty(true); }}
          placeholder="Write your note..."
        />
      </div>
      <div className="editor-footer">
        <div className="row">
          <button className="btn" onClick={handleSave} disabled={!dirty && !note.isNew}>
            {note.isNew ? 'Create' : 'Save'}
          </button>
          {!note.isNew && (
            <button className="btn danger" onClick={() => onDelete(note)} aria-label="Delete note">
              Delete
            </button>
          )}
        </div>
        <div className="helper">{dirty ? 'Unsaved changes' : 'All changes saved'}</div>
      </div>
    </div>
  );
}

export default NoteEditor;
