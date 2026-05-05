# MERN Book Store

Full-stack MERN (MongoDB, Express, React, Node.js) book inventory app with a public storefront and an admin dashboard for managing books.

## Features

- Browse books and view details
- Admin dashboard for uploading, editing, and deleting books
- Local authentication (email/password) with JWT sessions
- Role-based access control (admin-only write operations)
- Validation + consistent API errors
- Automated tests (backend + frontend) and GitHub Actions CI

## Tech Stack

- Frontend: React, React Router, Vite, Tailwind, Flowbite React, Vitest + React Testing Library
- Backend: Node.js, Express, MongoDB, JWT, bcrypt, Zod, Jest + Supertest

## Getting Started

### Prerequisites

- Node.js + npm
- MongoDB (Atlas or local)

### Installation

- Install backend deps

```bash
cd backend
npm install
```

- Install frontend deps

```bash
cd ../frontend
npm install
```

### Usage

- Backend env

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set at least:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

- Start backend

```bash
cd backend
npm run dev
```

- Frontend env

```bash
cd frontend
cp .env.example .env
```

- Start frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books` (admin-only)
- `PATCH /api/books/:id` (admin-only)
- `DELETE /api/books/:id` (admin-only)

## Scripts

- Backend
  - `npm run dev`
  - `npm test`
- Frontend
  - `npm run dev`
  - `npm run lint`
  - `npm test`
  - `npm run build`
