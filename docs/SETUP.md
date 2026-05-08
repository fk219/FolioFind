# 🛠️ FolioFind Setup Guide

Complete step-by-step guide to set up and run FolioFind locally.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Clone Repository](#clone-repository)
3. [Database Setup](#database-setup)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Deployment](#deployment)

---

## System Requirements

### Required Software

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **Git**: Latest version
- **MongoDB**: Either Atlas (cloud) or local instance

### Recommended Software

- **VS Code**: Code editor
- **MongoDB Compass**: MongoDB GUI tool (optional)
- **Postman**: API testing (optional)

### Check Your Versions

```bash
node --version      # Should be v18.x or higher
npm --version       # Should be v9.x or higher
git --version       # Any recent version
```

---

## Clone Repository

```bash
# Clone the repository
git clone https://github.com/fk219/FolioFind.git

# Navigate to project directory
cd FolioFind

# (Optional) Checkout latest branch
git checkout trae/solo-agent-wHEK6l
```

---

## Database Setup

### Option 1: MongoDB Atlas (Cloud) - RECOMMENDED

#### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email and password
4. Create organization and project

#### Step 2: Create Database Cluster

1. Click "Create" button
2. Select "Shared" (free tier)
3. Choose region (pick one closest to you)
4. Click "Create Cluster"
5. Wait for cluster to be created (5-10 minutes)

#### Step 3: Create Database User

1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. **Username**: `folioFind_user` (or your choice)
4. **Password**: Generate strong password (copy and save it!)
5. Click "Add User"

#### Step 4: Get Connection String

1. Go back to "Deployment" → "Clusters"
2. Click "Connect" button
3. Select "Drivers"
4. Choose "Node.js" version 4.1 or later
5. Copy the connection string

Your connection string looks like:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/folioFind?retryWrites=true&w=majority
```

**Replace:**
- `username` with your database user
- `password` with your password
- `folioFind` with your preferred database name

---

### Option 2: MongoDB Local

#### Step 1: Install MongoDB Community Edition

**Windows:**
1. Download from [mongodb.com/try/download/community](https://mongodb.com/try/download/community)
2. Run installer (.msi file)
3. Follow installation wizard
4. Keep default settings
5. MongoDB will start automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Step 2: Verify Installation

```bash
mongosh  # Opens MongoDB shell
# You should see: folioFind>
exit     # Type exit to quit
```

#### Step 3: Connection String

For local MongoDB:
```
mongodb://localhost:27017/folioFind
```

---

## Backend Configuration

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs all required packages (Express, MongoDB, JWT, etc.)

### Step 2: Create Environment File

```bash
# Copy example env file
cp .env.example .env
```

### Step 3: Configure Environment Variables

Open `backend/.env` and fill in:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/folioFind

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin Account (created on first startup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123!
```

#### Detailed Explanations

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for JWT signing (KEEP SECRET!) | `abc123...xyz` |
| `JWT_EXPIRES_IN` | Token expiry time | `7d`, `24h`, `3600s` |
| `ADMIN_EMAIL` | Admin account email | `admin@folioFind.com` |
| `ADMIN_PASSWORD` | Admin account password | `SecurePassword123!` |

### Step 4: Generate JWT Secret

```bash
# On Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# On macOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `JWT_SECRET` in `.env`

### Step 5: Verify Backend Setup

```bash
# Still in backend directory
npm run dev
```

You should see:
```
Server running on port 5000
Connected to MongoDB
```

Press `Ctrl+C` to stop (we'll run it properly next)

---

## Frontend Configuration

### Step 1: Install Frontend Dependencies

```bash
# Navigate to frontend directory (from project root)
cd frontend
npm install
```

### Step 2: Create Environment File

```bash
# Copy example env file
cp .env.example .env
```

### Step 3: Configure Environment Variables

Open `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Explanation:**
- `VITE_API_BASE_URL`: Backend API URL for development
- Change to production API URL when deploying

### Step 4: Verify Frontend Setup

```bash
# Still in frontend directory
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Press `Ctrl+C` to stop

---

## Running the Application

### Method 1: Separate Terminals (Recommended for Development)

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

### Method 2: Using npm-run-all (One Command)

Install globally:
```bash
npm install -g npm-run-all
```

From project root:
```bash
npm-run-all --parallel backend:dev frontend:dev
```

---

## First Time Setup Checklist

- [ ] Node.js v18+ installed
- [ ] Project cloned to your computer
- [ ] MongoDB cluster created (Atlas or local)
- [ ] Backend `.env` configured with:
  - [ ] `MONGO_URI` (database connection)
  - [ ] `JWT_SECRET` (generated)
  - [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- [ ] Frontend `.env` configured with:
  - [ ] `VITE_API_BASE_URL=http://localhost:5000`
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Successfully logged in with admin account

---

## Testing Setup

### Run Backend Tests

```bash
cd backend
npm test
```

Expected output:
```
PASS  tests/auth.test.js
PASS  tests/books.test.js
Tests:       6 passed, 6 total
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

Expected output:
```
✓ src/contexts/__tests__/AuthProvider.test.jsx (1)
✓ src/PrivateRoute/__tests__/PrivateRoute.test.jsx (1)
Tests: 2 passed (2)
```

---

## Troubleshooting

### Cannot Connect to MongoDB

**Problem:** Error: `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. **MongoDB not running:**
   - macOS: `brew services start mongodb-community`
   - Windows: Check MongoDB service in Services app
   - Linux: `sudo systemctl start mongodb`

2. **Wrong connection string:**
   - Verify `MONGO_URI` in `backend/.env`
   - Check username/password if using Atlas
   - Ensure database name is correct

3. **Network access issue (Atlas):**
   - Go to MongoDB Atlas → Security → Network Access
   - Add your IP address to whitelist
   - Or add "0.0.0.0" for all IPs (not recommended for production)

---

### Port Already in Use

**Problem:** Error: `listen EADDRINUSE :::5000`

**Solution 1:** Change port in `backend/.env`
```env
PORT=5001
```

**Solution 2:** Kill process using port (Windows PowerShell)
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution 2:** Kill process using port (macOS/Linux)
```bash
lsof -i :5000
kill -9 <PID>
```

---

### Frontend Can't Connect to Backend

**Problem:** API requests fail, 404 errors

**Solutions:**
1. **Check `VITE_API_BASE_URL`:**
   - Should be exactly: `http://localhost:5000`
   - No trailing slash

2. **Backend not running:**
   - Start backend with `npm run dev` in backend directory

3. **CORS issue:**
   - Check `CORS_ORIGIN` in `backend/.env`
   - Should match frontend URL: `http://localhost:5173`

4. **Browser console errors:**
   - Open DevTools (F12)
   - Check "Console" and "Network" tabs
   - Look for specific error messages

---

### Tests Failing

**Problem:** `npm test` fails

**Solutions:**
1. **Clear cache:**
   ```bash
   cd backend && npm test -- --clearCache
   cd frontend && npm test -- --clearCache
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check MongoDB test connection:**
   - Backend tests use in-memory MongoDB
   - Requires `mongodb-memory-server` (should be installed)

---

### Port 3000 or 5173 Already in Use

**Problem:** Frontend won't start

**Solution:**
Edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 5174  // Use different port
  }
}
```

---

### JWT Secret Not Set

**Problem:** Error: `Server misconfigured: missing JWT_SECRET`

**Solution:**
1. Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Copy output to `backend/.env` `JWT_SECRET` variable
3. Restart backend server

---

### Admin Account Not Created

**Problem:** Can't login with admin credentials

**Solutions:**
1. **Check admin credentials in `backend/.env`:**
   - `ADMIN_EMAIL=admin@example.com`
   - `ADMIN_PASSWORD=YourPassword123!`

2. **Restart backend** to trigger seeding:
   ```bash
   # Stop backend (Ctrl+C)
   # Start backend again
   npm run dev
   ```

3. **Clear database and restart:**
   - In MongoDB Atlas: Delete database
   - In local MongoDB: Use MongoDB Compass to delete database
   - Restart backend (will recreate database and admin)

---

## Deployment

### Deploy Backend to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect GitHub repository
4. Select `backend` directory
5. Set environment variables (see `backend/.env.example`)
6. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Next Steps

After setup is complete:

1. **Explore the app:**
   - Register a new user
   - Browse books
   - If admin, upload a test book

2. **Run tests:**
   ```bash
   npm test  # in backend and frontend directories
   ```

3. **Read documentation:**
   - [API.md](./API.md) - API endpoints
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - How it works

4. **Make changes:**
   - Frontend: Edit files in `frontend/src`
   - Backend: Edit files in `backend/src`
   - Changes auto-reload with dev servers

---

## Quick Reference Commands

```bash
# Backend commands
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm test             # Run tests
npm run lint         # Check code quality
npm start            # Start production server

# Frontend commands
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm test             # Run tests
npm run lint         # Check code quality
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Still Having Issues?

1. **Check console errors** (F12 → Console tab)
2. **Check network requests** (F12 → Network tab)
3. **Read error messages carefully** - they usually tell you exactly what's wrong
4. **Try restarting** - Stop servers and start again
5. **Clear cache** - Delete `node_modules` and reinstall
6. **Check environment variables** - Ensure `.env` files are correct
7. **Verify MongoDB** - Make sure database is running and accessible

---

**Setup Guide Last Updated:** May 9, 2026  
**Status:** Complete and tested ✅
