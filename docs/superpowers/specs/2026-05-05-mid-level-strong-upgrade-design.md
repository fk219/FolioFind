# Mid-Level Strong Upgrade Design (MERN Book Store)

## Goals

- Remove secrets from source and make configuration environment-driven
- Make the backend production-shaped: layered structure, validation, authZ, and consistent errors
- Replace Firebase authentication with a local authentication system (JWT) and role-based access
- Add automated tests and CI to demonstrate engineering maturity
- Improve developer experience (scripts, docs, reproducible setup)

## Non-Goals

- Adding payments, search engine, recommendations, or other product expansion features
- Migrating the entire codebase to TypeScript (can be a follow-up)
- Building a full admin UI redesign (keep UI mostly as-is, integrate new auth)

## Current State (Key Issues)

- Secrets are committed:
  - MongoDB connection string is hardcoded in backend code
  - Firebase configuration is hardcoded in frontend code
- Backend has no auth: any client can upload/update/delete books
- Backend API lacks input validation and consistent error handling
- Backend has a duplicate `/all-books` route handler
- Frontend hardcodes API base URL in multiple components
- No tests, no CI workflow, no deployment/ops guidance beyond basic README

## Target Architecture

### Backend (Node/Express + MongoDB)

Move from a single server file to a small layered structure:

- `backend/src/server.js`: starts HTTP server
- `backend/src/app.js`: Express app, middleware, routes, error handler
- `backend/src/db/client.js`: Mongo client connection and collection accessors
- `backend/src/routes/auth.js`: auth endpoints
- `backend/src/routes/books.js`: book endpoints
- `backend/src/controllers/*.js`: request handlers
- `backend/src/middleware/auth.js`: JWT verification, attaches `req.user`
- `backend/src/middleware/requireAdmin.js`: enforces `req.user.role === "admin"`
- `backend/src/middleware/errorHandler.js`: consistent JSON errors
- `backend/src/validation/*.js`: schema validation for payloads

### Frontend (React/Vite)

- Replace Firebase auth context with API-based auth context
- Store JWT client-side and send it on requests (default: `Authorization: Bearer <token>`)
- Use a single env-based API base URL:
  - `VITE_API_BASE_URL=http://localhost:5000`

## Configuration

### Backend env vars

- `PORT`
- `MONGO_URI`
- `CORS_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Files:

- `backend/.env.example` (no secrets)
- `backend/.env` (local only; ignored by git)

### Frontend env vars

- `VITE_API_BASE_URL`

Files:

- `frontend/.env.example`
- `frontend/.env` (local only; ignored by git)

## Data Model

### books

The existing `Books` collection remains, but book payloads will be validated before write.

### users

New collection `users`:

- `_id`
- `email` (unique)
- `passwordHash`
- `role`: `"admin"` or `"user"`
- `createdAt`

## Authentication & Authorization

### Authentication (Local)

Endpoints:

- `POST /api/auth/register`
  - Creates a normal user account (role `"user"`)
- `POST /api/auth/login`
  - Validates credentials, returns a JWT
- `GET /api/auth/me`
  - Requires JWT, returns current user (excluding `passwordHash`)

Password handling:

- Hash passwords with a modern algorithm (bcrypt)
- Never return password hashes to clients

JWT payload:

- `sub` (user id)
- `email`
- `role`

### Authorization (Admin-only writes)

Books endpoints:

- Public (no auth):
  - `GET /api/books`
  - `GET /api/books/:id`
- Admin-only:
  - `POST /api/books`
  - `PATCH /api/books/:id`
  - `DELETE /api/books/:id`

Enforcement:

- `requireAuth` middleware validates JWT and sets `req.user`
- `requireAdmin` middleware checks `req.user.role === "admin"`

### Admin seeding strategy

On server startup:

- If `ADMIN_EMAIL` + `ADMIN_PASSWORD` are present and no user exists for that email, create it with role `"admin"`
- If user exists, do nothing

Rationale:

- Prevents “register as admin” vulnerabilities
- Makes local/demo setup easy and repeatable

## API Contract (Books)

Replace `/upload-book`, `/all-books`, `/book/:id` with:

- `GET /api/books?category=<optional>`
- `GET /api/books/:id`
- `POST /api/books`
- `PATCH /api/books/:id`
- `DELETE /api/books/:id`

Backward compatibility:

- Not required; frontend will be updated to use the new paths

## Validation & Error Handling

Validation:

- Validate request bodies for auth and books
- Validate `:id` as a valid ObjectId before using it

Error responses:

- Use consistent JSON shape:
  - `statusCode`
  - `error`
  - `message`

## Security Hardening

- CORS restricted to configured origin
- Use `helmet` for common hardening headers
- Rate limit auth endpoints to reduce brute force attempts
- Avoid verbose logging of secrets and tokens

## Testing Strategy

### Backend

Tools:

- Jest + Supertest

Test coverage:

- Auth:
  - register success/failure
  - login success/failure
  - `/me` requires token
- Books:
  - anonymous can read
  - non-admin cannot write
  - admin can create/update/delete

### Frontend

Tools:

- Vitest + React Testing Library

Tests:

- Auth context: login/logout state transitions (mock fetch)
- Route protection: dashboard guarded when user is not authenticated

## CI

GitHub Actions workflow:

- Backend job: install, lint, test
- Frontend job: install, lint, test, build

## Documentation Deliverables

Update root README to include:

- Feature overview + screenshots
- Architecture overview (frontend/backend responsibilities)
- Setup steps with env vars
- Scripts (dev/test/build)
- Deployment notes (Vercel/Netlify options)

## Open Decisions

- Signup policy:
  - Default: public user registration enabled (role `"user"`)
  - Admin account is created via env seeding only
- JWT storage:
  - Default is Authorization header with token stored client-side
  - Cookie-based auth is a follow-up option if required
