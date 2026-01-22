# Fastivalle Mobile Application

## Project Overview

Fastivalle is a mobile application for event discovery, ticket purchasing, and event management. This repository contains the complete implementation including the React Native mobile app, NestJS backend API, and infrastructure configurations.

## Repository Structure

```
figma-full/
├── mobile/              # React Native mobile app
├── backend/             # NestJS API
├── infrastructure/      # Terraform, Docker configs
├── docs/                # Additional documentation
└── [documentation files]
```

## How to Run This Project

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop)) - For PostgreSQL and Redis
- **React Native development environment:**
  - **iOS**: Xcode (macOS only) - [Download](https://developer.apple.com/xcode/)
  - **Android**: Android Studio - [Download](https://developer.android.com/studio)

### Step-by-Step Setup

#### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and mobile)
npm run install:all

# Or install manually:
npm install
cd backend && npm install
cd ../mobile && npm install

# For iOS (macOS only):
cd mobile/ios && pod install && cd ../..
```

#### 2. Set Up Environment Variables

**Backend Environment (`backend/.env`):**

Create `backend/.env` file with:

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://fastivalle:fastivalle@localhost:5432/fastivalle
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=fastivalle
DB_PASSWORD=fastivalle
DB_DATABASE=fastivalle

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Optional (for full functionality):
# STRIPE_SECRET_KEY=sk_test_...
# FIREBASE_PROJECT_ID=...
# SENDGRID_API_KEY=...
# SENTRY_DSN=...
```

**Mobile Environment (`mobile/.env`):**

Create `mobile/.env` file with:

```env
API_BASE_URL=http://localhost:3000
API_VERSION=v1
ENVIRONMENT=development

# For iOS Simulator: use http://localhost:3000
# For Android Emulator: use http://10.0.2.2:3000
# For Physical Device: use your computer's IP (e.g., http://192.168.1.100:3000)
```

#### 3. Start Database Services

```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d

# Verify containers are running
docker-compose ps

# Check logs if needed
docker-compose logs -f
```

#### 4. Run Database Migrations

```bash
cd backend

# Run migrations to create database tables
npm run migration:run

# Verify database connection
# You can test with: psql -h localhost -U fastivalle -d fastivalle
```

#### 5. Start Backend API

**Terminal 1:**

```bash
# From project root
npm run backend:dev

# Or manually:
cd backend
npm run start:dev
```

Backend will be available at:
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/v1/health

#### 6. Start Mobile App

**Terminal 2 (for iOS - macOS only):**

```bash
# Start Metro bundler
cd mobile
npm start

# In another terminal, run iOS app:
npm run ios

# Or from project root:
npm run mobile:ios
```

**Terminal 2 (for Android):**

```bash
# Start Metro bundler
cd mobile
npm start

# In another terminal, run Android app:
npm run android

# Or from project root:
npm run mobile:android
```

### Verify Everything Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Mobile App:**
   - App should launch on simulator/emulator
   - Should connect to backend API
   - No errors in console

### Troubleshooting

**Backend won't start:**
- Check if port 3000 is available
- Verify database is running: `docker-compose ps`
- Check `.env` file exists and has correct values

**Mobile can't connect to backend:**
- **iOS Simulator**: Use `http://localhost:3000`
- **Android Emulator**: Use `http://10.0.2.2:3000`
- **Physical Device**: Use your computer's IP address (find with `ipconfig` on Windows or `ifconfig` on Mac/Linux)

**Database connection failed:**
- Ensure Docker containers are running: `docker-compose ps`
- Check database credentials in `backend/.env`
- Try restarting containers: `docker-compose restart`

**Migration errors:**
- Ensure database exists: `docker-compose up -d`
- Check database connection string in `.env`
- Verify TypeORM configuration

### Available Commands

**Root level:**
```bash
npm run install:all      # Install all dependencies
npm run backend:dev      # Start backend in development
npm run mobile:ios       # Run iOS app
npm run mobile:android   # Run Android app
npm test                 # Run all tests
```

**Backend (`cd backend`):**
```bash
npm run start:dev        # Start development server
npm run build            # Build for production
npm run migration:run   # Run database migrations
npm run migration:generate -- src/database/migrations/MigrationName  # Generate migration
npm test                 # Run tests
```

**Mobile (`cd mobile`):**
```bash
npm start                # Start Metro bundler
npm run ios              # Run iOS app
npm run android          # Run Android app
npm test                 # Run tests
```


## Technology Stack

### Frontend (Mobile)
- React Native 0.72+
- TypeScript 5.0+
- Redux Toolkit + RTK Query
- React Navigation 6+

### Backend
- NestJS 10+
- TypeScript 5.0+
- PostgreSQL 15+
- TypeORM
- Redis

### Infrastructure
- AWS (ECS, RDS, S3, CloudFront)
- Docker
- GitHub Actions

## Development Workflow

### Git Workflow
- **Main branch**: `main` (production-ready code)
- **Development branch**: `develop` (integration branch)
- **Feature branches**: `feature/feature-name`
- **Hotfix branches**: `hotfix/issue-name`

### Code Standards
- ESLint + Prettier for code formatting
- TypeScript strict mode
- Conventional Commits for commit messages
- Code reviews required before merging

## Testing

```bash
# Run all tests
npm test

# Run mobile tests
cd mobile && npm test

# Run backend tests
cd backend && npm test
```

## Deployment

See infrastructure documentation for deployment instructions.

## License

All IP remains property of the client. This repository contains technical documentation and implementation.
