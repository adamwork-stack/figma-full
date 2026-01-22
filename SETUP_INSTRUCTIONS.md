# Fastivalle Setup Instructions

## Initial Setup

### 1. Prerequisites Installation

#### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Redis** ([Download](https://redis.io/download))
- **Docker** (optional, for database services) ([Download](https://www.docker.com/))

#### For Mobile Development
- **iOS**: Xcode (macOS only) ([Download](https://developer.apple.com/xcode/))
- **Android**: Android Studio ([Download](https://developer.android.com/studio))

### 2. Clone Repository

```bash
git clone <repository-url>
cd figma-full
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install

# For iOS (macOS only)
cd ios
pod install
cd ..
```

### 4. Environment Configuration

#### Backend Environment

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   
   DATABASE_URL=postgresql://fastivalle:fastivalle@localhost:5432/fastivalle
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=fastivalle
   DB_PASSWORD=fastivalle
   DB_DATABASE=fastivalle
   
   REDIS_URL=redis://localhost:6379
   
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_SECRET=your-refresh-secret-key-change-in-production
   REFRESH_TOKEN_EXPIRES_IN=7d
   ```

#### Mobile Environment

1. Copy the example environment file:
   ```bash
   cd mobile
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   API_BASE_URL=http://localhost:3000
   API_VERSION=v1
   ENVIRONMENT=development
   ```

### 5. Database Setup

#### Option A: Using Docker Compose (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify containers are running
docker-compose ps
```

#### Option B: Manual Setup

1. **PostgreSQL**:
   ```bash
   # Create database
   createdb fastivalle
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE fastivalle;
   ```

2. **Redis**:
   ```bash
   # Start Redis server
   redis-server
   ```

### 6. Run Database Migrations

```bash
cd backend

# Generate initial migration (if needed)
npm run migration:generate -- -n InitialMigration

# Run migrations
npm run migration:run
```

### 7. Start Development Servers

#### Terminal 1: Backend API
```bash
cd backend
npm run start:dev
```

The API will be available at: `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api/docs`

#### Terminal 2: Mobile App (iOS)
```bash
cd mobile
npm run ios
```

#### Terminal 3: Mobile App (Android)
```bash
cd mobile
npm run android
```

## Verification

### Backend Health Check

```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-21T..."
}
```

### Mobile App

- App should launch on simulator/device
- Should connect to backend API
- No errors in console

## Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Port Already in Use**
- Change `PORT` in `.env`
- Or kill process using port 3000

### Mobile Issues

**Metro Bundler Issues**
```bash
cd mobile
npm start -- --reset-cache
```

**iOS Build Issues**
```bash
cd mobile/ios
pod install
cd ..
npm run ios
```

**Android Build Issues**
```bash
cd mobile/android
./gradlew clean
cd ..
npm run android
```

**Module Resolution Errors**
- Clear node_modules and reinstall
- Check babel.config.js paths
- Verify tsconfig.json paths

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes**
   - Backend: Add/modify modules in `backend/src/modules/`
   - Mobile: Add/modify screens in `mobile/src/screens/`

3. **Run tests**
   ```bash
   # Backend
   cd backend && npm test
   
   # Mobile
   cd mobile && npm test
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/feature-name
   ```

## Next Steps

After setup is complete:

1. Review [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
2. Check [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
3. Start implementing features following the guide
4. Refer to [API_SPECIFICATION.md](API_SPECIFICATION.md) for API details
5. Refer to [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for database structure

## Additional Resources

- [Technical Proposal](TECHNICAL_PROPOSAL.md)
- [System Architecture](SYSTEM_ARCHITECTURE.md)
- [Requirements Specification](REQUIREMENTS_SPECIFICATION.md)
