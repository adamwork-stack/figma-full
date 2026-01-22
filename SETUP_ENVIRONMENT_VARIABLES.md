# Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Backend Environment Variables

#### Step 1: Create Backend .env File

Navigate to the backend directory and create a `.env` file:

```bash
cd backend
copy .env.example .env
# Or on Linux/Mac: cp .env.example .env
```

#### Step 2: Configure Backend Environment Variables

Open `backend/.env` and configure the following:

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://fastivalle:fastivalle@localhost:5432/fastivalle
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=fastivalle
DB_PASSWORD=fastivalle
DB_DATABASE=fastivalle

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
# IMPORTANT: Generate strong secrets for production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS Configuration (for production)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=fastivalle-media-staging

# Stripe Configuration
# Get these from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Firebase Configuration (for push notifications)
# Get these from: https://console.firebase.google.com/
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Email Service (SendGrid)
# Get API key from: https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM=noreply@fastivalle.com

# Sentry (Error Tracking)
# Get DSN from: https://sentry.io/
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Step 3: Generate Secure Secrets

**For JWT Secrets**, use a strong random string generator:

**On Windows (PowerShell):**
```powershell
# Generate random secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**On Linux/Mac:**
```bash
# Generate random secret
openssl rand -base64 64
```

**Or use online tool:**
- Visit: https://www.random.org/strings/
- Generate 64-character random string
- Use for both JWT_SECRET and REFRESH_TOKEN_SECRET

### 2. Mobile Environment Variables

#### Step 1: Create Mobile .env File

Navigate to the mobile directory:

```bash
cd mobile
copy .env.example .env
# Or on Linux/Mac: cp .env.example .env
```

#### Step 2: Configure Mobile Environment Variables

Open `mobile/.env` and configure:

```env
# API Configuration
API_BASE_URL=http://localhost:3000
API_VERSION=v1

# Environment
ENVIRONMENT=development

# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Firebase Configuration
# Get these from Firebase Console: https://console.firebase.google.com/
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Stripe Publishable Key (for client-side payment)
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### Step 3: Install react-native-config (for .env support)

```bash
cd mobile
npm install react-native-config
```

Update `mobile/babel.config.js` to include react-native-config plugin:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@utils': './src/utils',
          '@theme': './src/theme',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
```

### 3. Environment-Specific Configurations

#### Development Environment

**Backend `.env`:**
- Use local PostgreSQL and Redis
- Use Stripe test keys
- Use development Firebase project
- Set NODE_ENV=development

**Mobile `.env`:**
- API_BASE_URL=http://localhost:3000 (or your local IP: http://192.168.x.x:3000)
- ENVIRONMENT=development
- Use test Stripe keys

#### Staging Environment

**Backend `.env`:**
- Use staging database (RDS or local)
- Use Stripe test keys
- Use staging Firebase project
- Set NODE_ENV=staging
- Configure staging AWS credentials

**Mobile `.env`:**
- API_BASE_URL=https://staging-api.fastivalle.com
- ENVIRONMENT=staging
- Use test Stripe keys

#### Production Environment

**Backend `.env`:**
- Use production RDS database
- Use Stripe live keys
- Use production Firebase project
- Set NODE_ENV=production
- Configure production AWS credentials
- Use strong, unique secrets

**Mobile `.env`:**
- API_BASE_URL=https://api.fastivalle.com
- ENVIRONMENT=production
- Use live Stripe keys

### 4. Securing Environment Variables

#### Never Commit .env Files

Ensure `.env` files are in `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

#### Use Environment Variable Managers

**For Development:**
- Keep `.env` files local
- Document required variables in `.env.example`

**For Production:**
- Use AWS Secrets Manager
- Use environment variables in CI/CD
- Never hardcode secrets

### 5. Verifying Configuration

#### Test Backend Configuration

```bash
cd backend
npm run start:dev
```

Check console output:
- Database connection successful
- Server running on port 3000
- No configuration errors

#### Test Mobile Configuration

```bash
cd mobile
npm start
```

Check that:
- Metro bundler starts
- No environment variable errors
- API base URL is correct

### 6. Common Issues and Solutions

#### Issue: Database Connection Failed

**Solution:**
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check database credentials in `.env`
3. Ensure database exists: `createdb fastivalle`

#### Issue: Redis Connection Failed

**Solution:**
1. Verify Redis is running: `docker-compose ps`
2. Check REDIS_URL in `.env`
3. Test connection: `redis-cli ping`

#### Issue: JWT Errors

**Solution:**
1. Ensure JWT_SECRET is set and at least 32 characters
2. Ensure REFRESH_TOKEN_SECRET is different from JWT_SECRET
3. Restart backend after changing secrets

#### Issue: Mobile Can't Connect to Backend

**Solution:**
1. For iOS Simulator: Use `http://localhost:3000`
2. For Android Emulator: Use `http://10.0.2.2:3000`
3. For Physical Device: Use your computer's IP: `http://192.168.x.x:3000`
4. Ensure backend CORS_ORIGIN allows mobile app origin

### 7. Quick Setup Script

Create `setup-env.sh` (Linux/Mac) or `setup-env.ps1` (Windows):

**setup-env.sh:**
```bash
#!/bin/bash

# Backend setup
cd backend
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Backend .env created. Please configure it."
else
  echo "Backend .env already exists."
fi

# Mobile setup
cd ../mobile
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Mobile .env created. Please configure it."
else
  echo "Mobile .env already exists."
fi

echo "Environment files created. Please edit them with your configuration."
```

**setup-env.ps1:**
```powershell
# Backend setup
cd backend
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Backend .env created. Please configure it."
} else {
    Write-Host "Backend .env already exists."
}

# Mobile setup
cd ../mobile
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Mobile .env created. Please configure it."
} else {
    Write-Host "Mobile .env already exists."
}

Write-Host "Environment files created. Please edit them with your configuration."
```

Run it:
```bash
# Linux/Mac
chmod +x setup-env.sh
./setup-env.sh

# Windows PowerShell
.\setup-env.ps1
```

## Next Steps

After setting up environment variables:
1. Start database services (Docker Compose)
2. Run database migrations
3. Start backend API
4. Start mobile app
5. Test the application
