# Complete Setup and Deployment Guide

## Overview

This is your complete roadmap from initial setup to app store submission. Follow these guides in order for a smooth implementation.

## 📚 Guide Index

### 1. Quick Start (Start Here!)
**File:** `QUICK_START_CHECKLIST.md`
- Fast setup checklist
- Get up and running in ~50 minutes
- Perfect for first-time setup

### 2. Environment Variables
**File:** `SETUP_ENVIRONMENT_VARIABLES.md`
- Detailed environment variable configuration
- Backend and mobile setup
- Security best practices
- Troubleshooting common issues

### 3. Database Migrations
**File:** `DATABASE_MIGRATIONS_GUIDE.md`
- Set up PostgreSQL database
- Run TypeORM migrations
- Create seed data
- Migration best practices

### 4. End-to-End Testing
**File:** `END_TO_END_TESTING_GUIDE.md`
- Complete testing workflow
- Backend API testing
- Mobile app testing
- Automated testing
- Performance testing
- Security testing

### 5. Staging Deployment
**File:** `STAGING_DEPLOYMENT_GUIDE.md`
- AWS infrastructure setup
- Terraform configuration
- ECS deployment
- Load balancer setup
- Domain and SSL configuration
- CI/CD pipeline

### 6. App Store Submission
**File:** `APP_STORE_SUBMISSION_GUIDE.md`
- iOS App Store submission
- Google Play Store submission
- Asset preparation
- Review process
- Post-submission monitoring

## 🚀 Recommended Workflow

### Phase 1: Local Development Setup (Day 1)

1. **Quick Start** (`QUICK_START_CHECKLIST.md`)
   - Set up environment variables
   - Install dependencies
   - Start services
   - Verify basic functionality

2. **Environment Variables** (`SETUP_ENVIRONMENT_VARIABLES.md`)
   - Configure all required variables
   - Set up third-party services (Stripe, Firebase, etc.)
   - Test connections

3. **Database Setup** (`DATABASE_MIGRATIONS_GUIDE.md`)
   - Run migrations
   - Create seed data
   - Verify database structure

**Time Estimate:** 2-4 hours

### Phase 2: Development & Testing (Week 1-2)

1. **Development**
   - Implement features
   - Fix bugs
   - Iterate on design

2. **Testing** (`END_TO_END_TESTING_GUIDE.md`)
   - Unit tests
   - Integration tests
   - E2E tests
   - Manual QA
   - Performance testing

**Time Estimate:** 1-2 weeks

### Phase 3: Staging Deployment (Week 3)

1. **Infrastructure** (`STAGING_DEPLOYMENT_GUIDE.md`)
   - Set up AWS account
   - Configure Terraform
   - Deploy infrastructure
   - Set up CI/CD

2. **Deploy to Staging**
   - Build Docker images
   - Deploy backend
   - Build mobile apps
   - Test on staging

**Time Estimate:** 3-5 days

### Phase 4: App Store Submission (Week 4)

1. **Prepare Assets** (`APP_STORE_SUBMISSION_GUIDE.md`)
   - Create app icons
   - Create screenshots
   - Write descriptions
   - Prepare privacy policy

2. **Submit**
   - iOS App Store
   - Google Play Store
   - Monitor reviews

**Time Estimate:** 1-2 weeks (including review time)

## 📋 Prerequisites Checklist

Before starting, ensure you have:

### Required Accounts
- [ ] GitHub account (for code repository)
- [ ] AWS account (for hosting)
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Developer account ($25 one-time)
- [ ] Stripe account (for payments)
- [ ] Firebase account (for push notifications)
- [ ] SendGrid account (for emails, optional)
- [ ] Sentry account (for error tracking, optional)

### Required Software
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] PostgreSQL 15+ OR Docker installed
- [ ] Redis OR Docker installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] AWS CLI installed (for deployment)
- [ ] Terraform installed (for infrastructure)
- [ ] Docker installed (for containers)

### Required Tools (Mobile)
- [ ] Xcode (for iOS, macOS only)
- [ ] Android Studio (for Android)
- [ ] CocoaPods (for iOS dependencies)

## 🎯 Step-by-Step Execution Plan

### Step 1: Initial Setup (Today)

```bash
# 1. Clone repository (if not already done)
git clone <your-repo-url>
cd figma-full

# 2. Follow Quick Start Checklist
# Open: QUICK_START_CHECKLIST.md
# Complete all items in checklist

# 3. Verify setup
cd backend && npm run start:dev
# In another terminal:
cd mobile && npm start
```

### Step 2: Configure Environment (Today)

```bash
# 1. Set up backend environment
cd backend
cp .env.example .env
# Edit .env with your values

# 2. Set up mobile environment
cd ../mobile
cp .env.example .env
# Edit .env with your values

# 3. Generate secrets
# Use: openssl rand -base64 64
```

### Step 3: Database Setup (Today)

```bash
# 1. Start database services
docker-compose up -d

# 2. Run migrations
cd backend
npm run migration:run

# 3. Verify
psql -h localhost -U fastivalle -d fastivalle -c "\dt"
```

### Step 4: Development (Week 1-2)

```bash
# 1. Start backend
cd backend
npm run start:dev

# 2. Start mobile (in another terminal)
cd mobile
npm start

# 3. Run tests
cd backend && npm test
cd mobile && npm test
```

### Step 5: Staging Deployment (Week 3)

```bash
# 1. Configure AWS
aws configure

# 2. Set up infrastructure
cd infrastructure/terraform
terraform init
terraform plan
terraform apply

# 3. Deploy backend
# Follow STAGING_DEPLOYMENT_GUIDE.md
```

### Step 6: App Store Submission (Week 4)

```bash
# 1. Prepare assets
# Follow APP_STORE_SUBMISSION_GUIDE.md

# 2. Build iOS app
cd mobile/ios
# Archive in Xcode

# 3. Build Android app
cd mobile/android
./gradlew bundleRelease
```

## 🔧 Common Commands Reference

### Backend Commands

```bash
# Start development server
npm run start:dev

# Run migrations
npm run migration:run

# Generate migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run tests
npm test

# Build for production
npm run build
```

### Mobile Commands

```bash
# Start Metro bundler
npm start

# Run iOS
npm run ios

# Run Android
npm run android

# Run tests
npm test

# Build iOS
cd ios && xcodebuild

# Build Android
cd android && ./gradlew assembleRelease
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## 🐛 Troubleshooting

### Issue: Can't connect to database

**Solution:**
1. Check if PostgreSQL is running: `docker-compose ps`
2. Verify credentials in `.env`
3. Test connection: `psql -h localhost -U fastivalle -d fastivalle`

### Issue: Mobile app can't connect to backend

**Solution:**
1. Check backend is running: `curl http://localhost:3000/api/v1/health`
2. For iOS Simulator: Use `http://localhost:3000`
3. For Android Emulator: Use `http://10.0.2.2:3000`
4. For physical device: Use your computer's IP address

### Issue: Migration fails

**Solution:**
1. Check database exists: `psql -l | grep fastivalle`
2. Verify connection string in `.env`
3. Check migration files exist: `ls backend/src/database/migrations/`

### Issue: Build fails

**Solution:**
1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. For iOS: `cd ios && pod install`

## 📞 Getting Help

### Documentation Files

- `SETUP_INSTRUCTIONS.md` - General setup instructions
- `DEVELOPMENT_GUIDE.md` - Development workflow
- `TESTING_GUIDE.md` - Testing strategies
- `PERFORMANCE_OPTIMIZATION.md` - Performance tips
- `SECURITY_GUIDE.md` - Security best practices

### External Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeORM Documentation](https://typeorm.io/)
- [AWS Documentation](https://docs.aws.amazon.com/)

## ✅ Success Criteria

You'll know you're ready for production when:

- [x] All tests passing
- [x] No critical bugs
- [x] Performance meets requirements
- [x] Security audit passed
- [x] Staging environment working
- [x] App store assets prepared
- [x] Documentation complete
- [x] Team trained on deployment

## 🎉 Next Steps After Setup

1. **Continue Development**
   - Add new features
   - Fix bugs
   - Improve performance

2. **Monitor Production**
   - Set up monitoring (Sentry, CloudWatch)
   - Track metrics
   - Gather user feedback

3. **Iterate**
   - Plan next release
   - Prioritize features
   - Improve based on feedback

## 📝 Notes

- **Never commit `.env` files** - They contain sensitive information
- **Always test migrations** on development before production
- **Backup database** before major changes
- **Monitor costs** on AWS to avoid surprises
- **Keep dependencies updated** for security

## 🚨 Important Reminders

1. **Security**: Never commit secrets or API keys
2. **Backups**: Always backup before major changes
3. **Testing**: Test thoroughly before deploying
4. **Documentation**: Keep documentation updated
5. **Monitoring**: Set up alerts for production

---

**Good luck with your Fastivalle implementation! 🚀**

For specific questions, refer to the individual guide files listed at the top of this document.
