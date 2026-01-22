# Quick Start Checklist

Use this checklist to quickly set up and test the Fastivalle application.

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL 15+ installed OR Docker installed
- [ ] Redis installed OR Docker installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step 1: Environment Setup (15 minutes)

### Backend

- [ ] Navigate to `backend` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Configure database credentials in `.env`
- [ ] Configure JWT secrets (generate strong random strings)
- [ ] Configure Redis URL
- [ ] Save `.env` file

### Mobile

- [ ] Navigate to `mobile` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Set `API_BASE_URL=http://localhost:3000`
- [ ] Save `.env` file

## Step 2: Database Setup (10 minutes)

- [ ] Start Docker Compose: `docker-compose up -d`
- [ ] Verify containers running: `docker-compose ps`
- [ ] Navigate to `backend` directory
- [ ] Run migrations: `npm run migration:run`
- [ ] Verify tables created (optional: `psql` check)

## Step 3: Install Dependencies (10 minutes)

### Backend

- [ ] Navigate to `backend`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

### Mobile

- [ ] Navigate to `mobile`
- [ ] Run: `npm install`
- [ ] For iOS (macOS only): `cd ios && pod install && cd ..`
- [ ] Wait for installation to complete

## Step 4: Start Services (5 minutes)

### Terminal 1: Database (if not using Docker)

- [ ] Start PostgreSQL
- [ ] Start Redis

### Terminal 2: Backend API

- [ ] Navigate to `backend`
- [ ] Run: `npm run start:dev`
- [ ] Verify: Server running on http://localhost:3000
- [ ] Test: Open http://localhost:3000/api/v1/health

### Terminal 3: Mobile App

- [ ] Navigate to `mobile`
- [ ] Run: `npm start` (Metro bundler)
- [ ] In another terminal: `npm run ios` OR `npm run android`
- [ ] Wait for app to launch

## Step 5: Quick Test (10 minutes)

### Backend API Test

```bash
# Test health endpoint
curl http://localhost:3000/api/v1/health

# Test registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

### Mobile App Test

- [ ] App launches successfully
- [ ] Login screen displays
- [ ] Can navigate to Sign Up
- [ ] Can fill registration form
- [ ] Can submit registration
- [ ] App navigates to main screen after registration

## Step 6: Verify Everything Works

### Backend Verification

- [ ] API responds to health check
- [ ] Can register user
- [ ] Can login user
- [ ] Can get events list
- [ ] Swagger docs accessible at /api/docs

### Mobile Verification

- [ ] App connects to backend
- [ ] Can register new user
- [ ] Can login
- [ ] Can view events (if any exist)
- [ ] Navigation works
- [ ] No console errors

## Common Issues Quick Fixes

### Backend Won't Start

```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # Mac/Linux

# Check database connection
psql -h localhost -U fastivalle -d fastivalle -c "SELECT 1;"
```

### Mobile Won't Connect to Backend

- **iOS Simulator**: Use `http://localhost:3000`
- **Android Emulator**: Use `http://10.0.2.2:3000`
- **Physical Device**: Use your computer's IP address

Find your IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
# Look for IPv4 address (e.g., 192.168.1.100)
```

Update mobile `.env`:
```
API_BASE_URL=http://192.168.1.100:3000
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check connection
psql -h localhost -U fastivalle -d fastivalle

# If database doesn't exist, create it
createdb fastivalle
```

## Next Steps After Setup

1. ✅ Environment variables configured
2. ✅ Database migrations run
3. ✅ Services running
4. ✅ Basic testing complete
5. → Proceed to comprehensive testing
6. → Deploy to staging
7. → Submit to app stores

## Getting Help

If you encounter issues:

1. Check logs:
   - Backend: Terminal 2 output
   - Mobile: Metro bundler output
   - Database: `docker-compose logs`

2. Verify configuration:
   - Environment variables are set correctly
   - Database is accessible
   - Ports are not blocked

3. Review documentation:
   - SETUP_INSTRUCTIONS.md
   - DEVELOPMENT_GUIDE.md
   - Troubleshooting sections

## Success Indicators

You'll know everything is working when:

✅ Backend API responds at http://localhost:3000/api/v1/health
✅ Swagger docs load at http://localhost:3000/api/docs
✅ Mobile app launches without errors
✅ Can register a new user
✅ Can login with registered user
✅ Can see main app screens
✅ No red error screens in mobile app
✅ No errors in backend console

## Time Estimate

- **Total Setup Time**: ~50 minutes
- **Environment Setup**: 15 minutes
- **Database Setup**: 10 minutes
- **Dependencies**: 10 minutes
- **Starting Services**: 5 minutes
- **Quick Testing**: 10 minutes

Good luck! 🚀
