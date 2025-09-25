/**
 * Base URL for backend API.
 * Prefer REACT_APP_API_BASE_URL from environment; otherwise default to the known backend port 3001.
 * This ensures that in preview/dev, requests go to FastAPI at :3001 instead of the frontend dev server :3000.
 * Example: https://vscode-internal-22120-qa.qa01.cloud.kavia.ai:3001
 */
const DEFAULT_BACKEND_BASE = 'https://vscode-internal-22120-qa.qa01.cloud.kavia.ai:3001';
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_API_BASE_URL.trim() !== '')
  ? process.env.REACT_APP_API_BASE_URL
  : DEFAULT_BACKEND_BASE;

const TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || 'notes_auth_token';

/**
 * Simple wrapper around fetch adding JSON headers and auth.
 */
async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token || localStorage.getItem(TOKEN_KEY);
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  // Try to parse JSON always
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || `Request failed with ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Authenticate user and store the JWT token in localStorage */
  const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
  if (data && data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  return data;
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clear the JWT token */
  localStorage.removeItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Return the JWT token from storage or null */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export async function getNotes() {
  /** Get the list of notes for the authenticated user. */
  return apiRequest('/notes', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note. note: {title, content} */
  return apiRequest('/notes', { method: 'POST', body: note });
}

// PUBLIC_INTERFACE
export async function updateNote(id, note) {
  /** Update an existing note by id. */
  return apiRequest(`/notes/${id}`, { method: 'PUT', body: note });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  return apiRequest(`/notes/${id}`, { method: 'DELETE' });
}
