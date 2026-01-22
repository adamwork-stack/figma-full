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

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis (for caching)
- React Native development environment:
  - iOS: Xcode (macOS only)
  - Android: Android Studio
- AWS account (for production deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd figma-full
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   - Copy `.env.example` files in `mobile/` and `backend/`
   - Configure your environment variables

4. **Set up database**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   docker-compose up -d
   
   # Run migrations
   cd backend
   npm run migration:run
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start backend API
   npm run backend:dev
   
   # Terminal 2: Start mobile app (iOS)
   npm run mobile:ios
   
   # Or for Android
   npm run mobile:android
   ```

## Documentation

- [Technical Proposal](TECHNICAL_PROPOSAL.md) - Complete technical approach
- [System Architecture](SYSTEM_ARCHITECTURE.md) - Architecture diagrams and design
- [API Specification](API_SPECIFICATION.md) - API endpoint documentation
- [Database Schema](DATABASE_SCHEMA.md) - Database design
- [Requirements Specification](REQUIREMENTS_SPECIFICATION.md) - Functional requirements
- [Project Structure](PROJECT_STRUCTURE.md) - Code organization guide

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
