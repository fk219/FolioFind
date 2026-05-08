# 📚 FolioFind - MERN Book Store

[![CI/CD Pipeline](https://github.com/fk219/FolioFind/actions/workflows/ci.yml/badge.svg)](https://github.com/fk219/FolioFind/actions/workflows/ci.yml)

Full-stack MERN (MongoDB, Express, React, Node.js) book inventory management system with a public storefront, admin dashboard, and production-grade authentication and authorization.

## 🎯 Project Highlights

This is a **production-ready, resume-worthy** MERN application demonstrating:

- ✅ **Full-stack architecture** with proper separation of concerns
- ✅ **JWT authentication** with bcrypt password hashing
- ✅ **Role-based authorization** (admin vs. user permissions)
- ✅ **Security best practices** (Helmet, rate limiting, CORS, input validation)
- ✅ **Comprehensive testing** (Jest, Supertest, Vitest, React Testing Library)
- ✅ **CI/CD pipeline** with GitHub Actions
- ✅ **Environment-driven configuration** (no hardcoded secrets)
- ✅ **Professional code organization** (layered architecture, consistent error handling)

## ✨ Features

### User Features
- ✅ Browse books and view detailed information
- ✅ User registration and login (email/password)
- ✅ Secure JWT-based authentication
- ✅ Responsive design across all devices

### Admin Features
- ✅ Admin dashboard for book management
- ✅ Upload new books with metadata
- ✅ Edit existing book information
- ✅ Delete books from inventory
- ✅ Role-based access control (only admins can write)

### Technical Features
- ✅ Automated test suite (backend + frontend)
- ✅ Input validation and sanitization
- ✅ Consistent error handling and responses
- ✅ Rate limiting on authentication endpoints
- ✅ Secure password hashing with bcrypt
- ✅ Environment-driven configuration
- ✅ Automated CI/CD with GitHub Actions

## 🏗️ Architecture Overview

### Backend Architecture
```
routes/auth.js, books.js
        ↓
controllers/authController.js, booksController.js
        ↓
middleware/auth.js, requireAdmin.js, errorHandler.js
        ↓
validation/authSchemas.js, bookSchemas.js
        ↓
db/client.js → MongoDB
```

The backend follows a **layered architecture**:
- **Routes**: Define API endpoints
- **Controllers**: Handle request logic
- **Middleware**: Auth validation, error handling
- **Validation**: Input schemas with Zod
- **Database**: MongoDB with connection pooling

### Frontend Architecture
```
React Router
    ↓
Protected Routes (PrivateRoute, AdminRoute)
    ↓
Auth Context (AuthProvider)
    ↓
API Clients (auth.js, books.js)
    ↓
Components (Login, Dashboard, Shop, etc.)
```

The frontend uses:
- **React Router** for client-side routing
- **Auth Context** for global auth state
- **Protected Routes** for role-based access
- **API clients** for backend communication

## 📦 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React, React Router, Vite | 18.2.0, 6.16.0, 4.4.5 |
| **Frontend Styling** | Tailwind CSS, Flowbite React | 3.3.3, 0.6.1 |
| **Frontend Testing** | Vitest, React Testing Library | 0.34.6, 14.3.1 |
| **Backend** | Node.js, Express | 18.x, 4.18.2 |
| **Database** | MongoDB | 6.8.0 |
| **Authentication** | JWT, bcryptjs | 9.0.2, 2.4.3 |
| **Validation** | Zod | 3.25.0 |
| **Security** | Helmet, express-rate-limit | 7.2.0, 7.5.0 |
| **Backend Testing** | Jest, Supertest | 29.7.0, 6.3.3 |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (Atlas cloud or local instance)
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/fk219/FolioFind.git
cd FolioFind
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/folioFind
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Account**: Use email and password from your `.env`

## 📚 API Documentation

For detailed API documentation, see [API.md](./docs/API.md)

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Books Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|----------------|------------|
| GET | `/api/books` | List all books | No | No |
| GET | `/api/books/:id` | Get book details | No | No |
| POST | `/api/books` | Create book | Yes | Yes |
| PATCH | `/api/books/:id` | Update book | Yes | Yes |
| DELETE | `/api/books/:id` | Delete book | Yes | Yes |

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

Tests include:
- ✅ User registration and validation
- ✅ User login and JWT generation
- ✅ Admin authorization checks
- ✅ Book CRUD operations
- ✅ Error handling

### Run Frontend Tests
```bash
cd frontend
npm test
```

Tests include:
- ✅ Authentication context state management
- ✅ Protected route access control
- ✅ Admin route authorization
- ✅ Component rendering

### View Test Coverage
```bash
cd backend
npm test -- --coverage

cd ../frontend
npm test -- --coverage
```

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration. The pipeline:

1. ✅ Runs backend tests with Jest
2. ✅ Runs frontend tests with Vitest
3. ✅ Lint checks (ESLint)
4. ✅ Frontend production build
5. ✅ Uploads build artifacts

View workflow: [.github/workflows/ci.yml](./.github/workflows/ci.yml)

## 📋 Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint (if configured)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm test         # Run tests
npm run preview  # Preview production build
```

## 🔐 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 50 requests per 15 minutes on auth endpoints
- **CORS**: Configured to trusted origins only
- **Security Headers**: Helmet.js for HTTP security headers
- **Input Validation**: Zod schemas for all inputs
- **Environment Secrets**: No hardcoded credentials in source

## 📁 Project Structure

```
FolioFind/
├── backend/
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── app.js                 # Express app setup
│   │   ├── config.js              # Configuration
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Auth, error handling
│   │   ├── validation/            # Zod schemas
│   │   └── db/                    # Database client
│   ├── tests/                     # Jest tests
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/                   # API clients
│   │   ├── contexts/              # Auth context
│   │   ├── pages/                 # Page components
│   │   ├── components/            # Reusable components
│   │   ├── PrivateRoute/          # Route protection
│   │   └── routers/               # Route definitions
│   ├── tests/                     # Vitest tests
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── API.md                     # API documentation
│   ├── SETUP.md                   # Setup guide
│   ├── ARCHITECTURE.md            # Architecture documentation
│   └── DEPLOYMENT.md              # Deployment guide
│
└── .github/workflows/
    └── ci.yml                     # GitHub Actions workflow
```

## 🚢 Deployment

### Deploy to Vercel

1. **Create Vercel Account** and connect GitHub repo
2. **Set Environment Variables** in Vercel dashboard:
   - Backend: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - Frontend: `VITE_API_BASE_URL` (production API URL)
3. **Deploy**: Vercel will auto-deploy on push to main

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 📖 Documentation

- [API Documentation](./docs/API.md) - Detailed endpoint reference
- [Setup Guide](./docs/SETUP.md) - Environment configuration
- [Architecture](./docs/ARCHITECTURE.md) - System design
- [Deployment](./docs/DEPLOYMENT.md) - Production deployment
- [Project Analysis](./PROJECT_ANALYSIS_AND_TODO.md) - Development roadmap

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**FolioFind** - A production-ready MERN book management system

- GitHub: [@fk219](https://github.com/fk219)
- Repository: [FolioFind](https://github.com/fk219/FolioFind)

## ⭐ Show Your Support

If you find this project useful, please give it a star! Your support helps others discover this project.

---

**Built with ❤️ as a demonstration of full-stack MERN development best practices**
