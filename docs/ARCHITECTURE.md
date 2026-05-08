# 🏗️ FolioFind Architecture Documentation

**Project:** FolioFind - MERN Book Management System  
**Last Updated:** May 9, 2026  
**Status:** Production Ready

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Authorization Flow](#authorization-flow)
7. [Data Flow](#data-flow)
8. [Deployment Architecture](#deployment-architecture)
9. [Design Decisions](#design-decisions)

---

## System Overview

FolioFind is a **full-stack MERN application** that demonstrates production-grade software architecture with proper separation of concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    FolioFind System                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐                  ┌──────────────┐ │
│  │   Frontend       │                  │   Backend    │ │
│  │   (React/Vite)   │◄───────API──────►│  (Express)   │ │
│  └──────────────────┘                  └──────────────┘ │
│                                              │            │
│                                              ▼            │
│                                        ┌──────────────┐  │
│                                        │  MongoDB     │  │
│                                        │  Database    │  │
│                                        └──────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Layered Architecture (MVC Pattern)

The backend follows a **layered architecture** for clean code organization and separation of concerns:

```
┌─────────────────────────────────────────┐
│           Routes Layer                   │
│    (Defines API endpoints)               │
│   ├─ /api/auth                          │
│   └─ /api/books                         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Controllers Layer                │
│   (Handles request logic)                │
│   ├─ authController.js                  │
│   └─ booksController.js                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Middleware Layer                 │
│  (Auth, validation, error handling)      │
│   ├─ auth.js (JWT verification)         │
│   ├─ requireAdmin.js (role check)       │
│   ├─ errorHandler.js (error responses) │
│   └─ Validation schemas (Zod)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Database Layer                   │
│   (MongoDB connection & operations)      │
│   └─ db/client.js                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         MongoDB Database                 │
│   (Persistent data storage)              │
└──────────────────────────────────────────┘
```

### Directory Structure

```
backend/
├── src/
│   ├── server.js              # HTTP server entry point
│   ├── app.js                 # Express app configuration
│   ├── config.js              # Environment configuration
│   │
│   ├── routes/                # API route definitions
│   │   ├── auth.js            # Authentication endpoints
│   │   └── books.js           # Book endpoints
│   │
│   ├── controllers/           # Request handlers (business logic)
│   │   ├── authController.js  # Auth operations
│   │   └── booksController.js # Book operations
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT verification
│   │   ├── requireAdmin.js    # Admin role check
│   │   └── errorHandler.js    # Global error handling
│   │
│   ├── validation/            # Input validation schemas
│   │   ├── authSchemas.js     # Auth payload schemas
│   │   └── bookSchemas.js     # Book payload schemas
│   │
│   └── db/                    # Database connection
│       └── client.js          # MongoDB client
│
├── tests/                     # Jest test suites
│   ├── auth.test.js          # Auth endpoint tests
│   ├── books.test.js         # Book endpoint tests
│   └── testDb.js             # Test database setup
│
├── package.json              # Dependencies
├── .env.example              # Environment template
└── .eslintrc.json           # Linting rules
```

### Request Flow Through Backend

```
HTTP Request
    │
    ▼
express.json() middleware (parse JSON)
    │
    ▼
cors() middleware (check origin)
    │
    ▼
helmet() middleware (security headers)
    │
    ▼
Route Matching (router.get|post|patch|delete)
    │
    ▼
Authentication Middleware (requireAuth)
    │ (JWT validation)
    ▼
Authorization Middleware (requireAdmin)
    │ (Role check)
    ▼
Validation Middleware (Zod schema parse)
    │ (Input validation)
    ▼
Controller Function (business logic)
    │ (Database operations)
    ▼
Response (res.json() or error)
    │
    ▼
Error Handler Middleware (if error thrown)
    │ (Format error response)
    ▼
HTTP Response
```

### Technology Choices

| Layer | Technology | Why |
|-------|-----------|-----|
| **Web Server** | Express | Industry standard, lightweight, battle-tested |
| **Database** | MongoDB | Flexible schema, JSON-like documents, Atlas cloud option |
| **Authentication** | JWT | Stateless, scalable, no server-side session storage |
| **Password** | bcryptjs | Industry standard for password hashing, salted hashing |
| **Validation** | Zod | Type-safe validation, great error messages |
| **Security** | Helmet | Protects against common HTTP header vulnerabilities |
| **Testing** | Jest + Supertest | Standard for Node.js, good mocking support |

---

## Frontend Architecture

### Component-Based Architecture

The frontend uses **React components** organized by feature:

```
Frontend/
├── src/
│   ├── App.jsx                # Main app component
│   │
│   ├── routers/               # Route definitions
│   │   └── router.jsx         # React Router setup
│   │
│   ├── contexts/              # Global state (Context API)
│   │   └── AuthProvider.jsx   # Auth state management
│   │
│   ├── PrivateRoute/          # Route protection
│   │   ├── PrivateRoute.jsx   # Auth-required routes
│   │   └── AdminRoute.jsx     # Admin-only routes
│   │
│   ├── api/                   # API clients
│   │   ├── http.js            # Fetch wrapper
│   │   ├── auth.js            # Auth API calls
│   │   └── books.js           # Books API calls
│   │
│   ├── pages/                 # Page components
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── Home/              # Homepage
│   │   ├── Shop/              # Shop page
│   │   ├── Dashboard/         # Admin dashboard
│   │   └── shared/            # Shared components (Navbar, Footer)
│   │
│   └── assets/                # Static assets
│       ├── images/
│       └── logos/
```

### State Management (AuthProvider)

```javascript
// AuthProvider Context
{
  user: {
    _id: string,
    email: string,
    role: "user" | "admin"
  },
  isLoading: boolean,
  error: string | null,
  login: (email, password) => Promise,
  register: (email, password) => Promise,
  logout: () => void
}
```

The `AuthProvider` component:
- Manages user authentication state globally
- Persists JWT token to localStorage
- Provides login/register/logout methods
- Wrapped around entire app for global access

### Protected Routes

```
Public Routes:
  GET /  (Home)
  GET /shop  (Shop page)
  GET /book/:id  (Single book)
  GET /login  (Login page)
  GET /signup  (Signup page)

Protected Routes (Auth Required):
  GET /dashboard  (Admin dashboard)
  POST /api/books  (Create book)
  PATCH /api/books/:id  (Edit book)
  DELETE /api/books/:id  (Delete book)

Admin Routes (Admin Only):
  GET /dashboard  (Admin dashboard)
  All write operations on books
```

### Frontend Data Flow

```
React Component
    │
    ▼
User Interaction (click, submit, etc.)
    │
    ▼
Event Handler / useEffect
    │
    ▼
API Client (api/auth.js or api/books.js)
    │ (adds Authorization header)
    ▼
HTTP Request to Backend
    │
    ▼
Response (data or error)
    │
    ▼
Update AuthProvider / Local State
    │
    ▼
Re-render Component
```

---

## Database Schema

### Users Collection

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  email: String (unique),           // User's email address
  passwordHash: String,             // bcrypt hashed password
  role: String ("user" | "admin"),  // User permission level
  createdAt: Date                   // Account creation timestamp
}
```

**Indexes:**
- `email`: Unique index for fast lookups and preventing duplicates

### Books Collection

Stores book inventory data.

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  bookTitle: String,                // Book name
  authorName: String,               // Author name
  category: String,                 // Book category (fiction, etc.)
  bookDescription: String,          // Description/summary
  imageURL: String,                 // Cover image URL
  bookPDFURL: String,               // PDF file URL (if available)
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

**Indexes:**
- None currently (can add for common filters like category)

---

## Authentication Flow

### User Registration

```
User enters email/password
    │
    ▼
POST /api/auth/register
    │
    ▼
Validate input (Zod schema)
    │
    ▼
Check if email already exists
    │
    ├─ YES → Return 409 Conflict
    │
    └─ NO → Continue
         │
         ▼
    Hash password with bcrypt
         │
         ▼
    Insert user into database
         │
         ▼
    Generate JWT token
         │
         ▼
    Return token + user info
         │
    ▼
Frontend: Store token in localStorage
          Auto-login user
```

### User Login

```
User enters email/password
    │
    ▼
POST /api/auth/login
    │
    ▼
Validate input (Zod schema)
    │
    ▼
Find user by email
    │
    ├─ NOT FOUND → Return 401 Unauthorized
    │
    └─ FOUND → Continue
        │
        ▼
    Compare password with hash (bcrypt.compare)
        │
        ├─ NO MATCH → Return 401 Unauthorized
        │
        └─ MATCH → Continue
            │
            ▼
        Generate JWT token
            │
            ▼
        Return token + user info
            │
    ▼
Frontend: Store token in localStorage
          Update AuthProvider state
```

### JWT Token Structure

```
Header: { alg: "HS256", typ: "JWT" }

Payload: {
  sub: "user-id",        // Subject (user ID)
  email: "user@example.com",
  role: "user|admin",
  iat: 1620000000,       // Issued at
  exp: 1620604800        // Expiration (7 days)
}

Signature: HMAC-SHA256(header.payload, JWT_SECRET)
```

---

## Authorization Flow

### Admin Check for Book Operations

```
Request to POST /api/books
    │
    ▼
requireAuth middleware
    │
    ├─ NO Authorization header → Return 401
    │
    ├─ Invalid JWT → Return 401
    │
    └─ Valid JWT → Continue (req.user populated)
        │
        ▼
    requireAdmin middleware
        │
        ├─ req.user.role !== "admin" → Return 403 Forbidden
        │
        └─ req.user.role === "admin" → Continue
            │
            ▼
        Validate request body (Zod)
            │
            ├─ Invalid → Return 400
            │
            └─ Valid → Continue
                │
                ▼
            Execute controller logic
                │
                ▼
            Create/Update/Delete in database
                │
                ▼
            Return response (201/200)
```

---

## Data Flow

### Complete User Journey: Create a Book

```
1. Admin logs in
   User submits email/password
       ↓
   POST /api/auth/login
       ↓
   Backend: Validate credentials
       ↓
   Backend: Generate JWT
       ↓
   Frontend: Store JWT in localStorage
       ↓
   Frontend: Update AuthProvider (user logged in)

2. Navigate to Dashboard
   Frontend: React Router checks if user is authenticated
       ↓
   PrivateRoute component checks AuthProvider
       ↓
   Dashboard loads (only admins can access)

3. Upload Book
   Admin fills form (title, author, category, etc.)
       ↓
   Frontend: Validate form data locally
       ↓
   Frontend: POST /api/books with JWT in Authorization header
       ↓
   Backend: requireAuth middleware verifies JWT
       ↓
   Backend: requireAdmin middleware checks role
       ↓
   Backend: Zod schema validates request body
       ↓
   Backend: booksController.create() inserts into MongoDB
       ↓
   Frontend: Receive 201 response
       ↓
   Frontend: Show success message
       ↓
   Frontend: Refresh book list

4. View Book in Shop
   Any user navigates to /shop
       ↓
   Frontend: GET /api/books (public endpoint, no auth required)
       ↓
   Backend: Return all books from database
       ↓
   Frontend: Display books in gallery
       ↓
   User clicks book
       ↓
   Frontend: Navigate to /books/:id
       ↓
   Frontend: GET /api/books/:id
       ↓
   Backend: Return book details
       ↓
   Frontend: Display detailed book page
```

---

## Deployment Architecture

### Development Environment

```
Your Computer
├─ Backend Server (localhost:5000)
│  ├─ Express listening on port 5000
│  ├─ Connected to MongoDB (local or Atlas)
│  └─ Hot-reload with nodemon
│
├─ Frontend Dev Server (localhost:5173)
│  ├─ Vite development server
│  ├─ Hot module replacement (HMR)
│  └─ API calls to localhost:5000
│
└─ MongoDB Database
   ├─ Local: localhost:27017
   └─ OR Atlas (cloud): cluster.mongodb.net
```

### Production Environment (Vercel)

```
User Browser
    │
    ├─→ Frontend (Vercel CDN)
    │   ├─ React app (built/optimized)
    │   ├─ Served as static files
    │   └─ API calls to backend
    │
    └─→ Backend (Vercel Serverless Function)
        ├─ Express running on Vercel
        ├─ Environment variables configured
        └─ Connected to MongoDB Atlas
```

---

## Design Decisions

### 1. Why JWT Instead of Session Cookies?

**Decision:** Use JWT tokens

**Rationale:**
- ✅ Stateless: No server-side session storage needed
- ✅ Scalable: Works with distributed systems/serverless
- ✅ Mobile-friendly: Can be sent via Authorization header
- ✅ Flexible: Can contain user info (email, role)

**Trade-off:** Token can't be revoked immediately (but 7-day expiry mitigates)

---

### 2. Why MongoDB Over SQL?

**Decision:** Use MongoDB

**Rationale:**
- ✅ Flexible schema: Easy to add fields later
- ✅ JSON-like: Natural fit with Node.js
- ✅ Easy scaling: Built-in horizontal scaling
- ✅ Atlas offering: Free cloud database tier

**Trade-off:** No relational integrity (but not needed for this app)

---

### 3. Why Layered Architecture?

**Decision:** Use MVC pattern with separate layers

**Rationale:**
- ✅ Separation of concerns: Each layer has one responsibility
- ✅ Testability: Controllers easy to unit test
- ✅ Maintainability: Easy to find and modify code
- ✅ Scalability: Can add new middleware without touching routes
- ✅ Reusability: Controllers can be reused by different routes

**Alternative:** Could use middleware functions directly in routes (simpler for small apps, harder to scale)

---

### 4. Why React Context for Auth State?

**Decision:** Use React Context API instead of Redux/Zustand

**Rationale:**
- ✅ Simple: No additional dependencies
- ✅ Built-in: Part of React
- ✅ Sufficient: Auth state is relatively simple
- ✅ Learning: Good for understanding state management

**Alternative:** Redux for larger apps with more complex state

---

### 5. Why Zod for Validation?

**Decision:** Use Zod instead of Joi/Yup

**Rationale:**
- ✅ Type-safe: Generates TypeScript types
- ✅ Modern: ES modules, modern syntax
- ✅ Small: Lightweight library
- ✅ Great errors: User-friendly validation messages

---

### 6. Why Admin Seeding on Startup?

**Decision:** Create admin account if it doesn't exist on server start

**Rationale:**
- ✅ Secure: Admins can't self-register
- ✅ Automatic: No manual database setup needed
- ✅ Environment-driven: Can create different admins in different environments
- ✅ Idempotent: Safe to restart server multiple times

---

## Performance Considerations

### Current Optimizations

1. **Database Indexes:** Email unique index for fast lookups
2. **Password Hashing:** Secure with bcrypt salt rounds
3. **JWT Expiry:** 7 days balances security and UX
4. **Rate Limiting:** 50 requests/15 min on auth endpoints
5. **CORS:** Restricted to configured origin

### Future Optimizations

1. Add pagination to `/api/books` endpoint
2. Add search/filtering by category
3. Add database indexes on frequently queried fields
4. Implement pagination on frontend
5. Add caching layer (Redis) for frequently accessed books
6. Optimize images (WebP, responsive sizes)
7. Code-split frontend components
8. Add API response compression (gzip)

---

## Security Considerations

### Current Measures

1. ✅ **Password Security:** Bcryptjs with salt rounds
2. ✅ **JWT Protection:** HS256 signature with secret key
3. ✅ **Input Validation:** Zod schemas validate all inputs
4. ✅ **CORS:** Configured to trusted origins only
5. ✅ **Security Headers:** Helmet.js protects common vulnerabilities
6. ✅ **Rate Limiting:** Prevents brute force on auth endpoints
7. ✅ **Authorization:** Role-based checks on write operations
8. ✅ **No Secrets in Code:** Environment-driven configuration

### Future Improvements

1. Implement HTTPS-only in production
2. Add CSRF protection if using cookies
3. Implement token refresh tokens (optional)
4. Add request rate limiting globally
5. Add logging and monitoring (Sentry)
6. Regular security audits and updates

---

## Testing Strategy

### Backend Tests (32 tests)

**Auth Tests (15 tests):**
- ✅ Register with valid/invalid email
- ✅ Duplicate email detection
- ✅ Login with correct/incorrect password
- ✅ Token validation on /me endpoint
- ✅ Missing authentication headers

**Book Tests (17 tests):**
- ✅ Public list/get operations
- ✅ Admin can create/update/delete
- ✅ Non-admin cannot write
- ✅ Invalid ObjectId handling
- ✅ Not found (404) scenarios

### Frontend Tests (2 tests)

- ✅ AuthProvider state management
- ✅ PrivateRoute protection
- ✅ AdminRoute authorization

---

## Documentation

- [README.md](../README.md) - Project overview and quick start
- [API.md](./API.md) - Complete API documentation
- [SETUP.md](./SETUP.md) - Environment setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

---

**Architecture Last Updated:** May 9, 2026  
**Status:** Production Ready ✅  
**Confidence:** High 🚀
