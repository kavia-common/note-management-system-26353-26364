# Ocean Notes Frontend

Modern React UI for the Notes application following the "Ocean Professional" style.

## Configure

Create a `.env` file (see `.env.example`):

- `REACT_APP_API_BASE_URL` FastAPI backend base URL (e.g., http://localhost:8000)
- `REACT_APP_AUTH_TOKEN_KEY` Storage key for JWT (optional)

## Run

- `npm start` start dev server
- `npm test` run tests
- `npm run build` production build

## Backend Endpoints

Expected endpoints:

- POST `/auth/login` body: { email, password } => { access_token }
- GET `/notes` => Note[]
- POST `/notes` => Note
- PUT `/notes/{id}` => Note
- DELETE `/notes/{id}` => { ok: true }

Note shape minimal: { id, title, content, updated_at? }
