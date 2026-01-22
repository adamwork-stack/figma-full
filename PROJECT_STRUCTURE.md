# Fastivalle - Project Structure

## Recommended Project Organization

### Monorepo Structure (Recommended)

```
figma-full/
├── mobile/                    # React Native mobile app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Buttons, Inputs, Cards, etc.
│   │   │   ├── layout/       # Headers, Navigation, Containers
│   │   │   └── forms/        # Form-specific components
│   │   ├── screens/          # Screen components
│   │   │   ├── auth/         # Login, Signup, ForgotPassword
│   │   │   ├── home/         # Home/Dashboard screens
│   │   │   ├── profile/      # User profile screens
│   │   │   └── [feature]/    # Other feature screens
│   │   ├── features/         # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── screens/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   ├── store/    # Feature-specific state
│   │   │   │   └── types/
│   │   │   ├── events/       # Events feature module
│   │   │   ├── tickets/      # Tickets feature module
│   │   │   └── [other-features]/
│   │   ├── navigation/        # Navigation configuration
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── MainNavigator.tsx
│   │   ├── store/            # Global state management
│   │   │   ├── slices/       # Redux slices
│   │   │   ├── api/          # RTK Query API
│   │   │   └── store.ts
│   │   ├── services/         # External services
│   │   │   ├── api/          # API client
│   │   │   ├── auth/         # Auth service
│   │   │   ├── storage/      # Local storage
│   │   │   └── notifications/ # Push notifications
│   │   ├── utils/            # Utilities
│   │   │   ├── formatters/   # Date, currency, etc.
│   │   │   ├── validators/   # Form validation
│   │   │   └── helpers/      # General helpers
│   │   ├── theme/            # Design system
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   └── theme.ts
│   │   ├── assets/           # Static assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── types/            # TypeScript types
│   │   │   ├── api.ts
│   │   │   ├── navigation.ts
│   │   │   └── models.ts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── constants/       # App constants
│   │   └── App.tsx          # Root component
│   ├── __tests__/           # Tests
│   │   ├── components/
│   │   ├── screens/
│   │   ├── utils/
│   │   └── __mocks__/
│   ├── android/             # Android native code
│   ├── ios/                 # iOS native code
│   ├── package.json
│   ├── tsconfig.json
│   ├── metro.config.js
│   └── .env.example
│
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── dto/     # Data Transfer Objects
│   │   │   │   └── entities/ # Database entities
│   │   │   ├── users/
│   │   │   ├── events/
│   │   │   ├── tickets/
│   │   │   └── [other-modules]/
│   │   ├── common/          # Shared code
│   │   │   ├── decorators/
│   │   │   ├── filters/     # Exception filters
│   │   │   ├── guards/      # Auth guards
│   │   │   ├── interceptors/
│   │   │   ├── pipes/       # Validation pipes
│   │   │   └── utils/
│   │   ├── config/          # Configuration
│   │   │   ├── database.config.ts
│   │   │   ├── app.config.ts
│   │   │   └── env.config.ts
│   │   ├── database/        # Database setup
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── typeorm.config.ts
│   │   ├── main.ts          # Application entry point
│   │   └── app.module.ts    # Root module
│   ├── test/                # Backend tests
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
├── infrastructure/          # Infrastructure as Code
│   ├── terraform/          # Terraform configurations
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── docker/             # Docker configurations
│       ├── Dockerfile.api
│       └── docker-compose.yml
│
├── docs/                    # Documentation
│   ├── api/                # API documentation
│   ├── architecture/       # Architecture diagrams
│   └── deployment/         # Deployment guides
│
├── scripts/                 # Utility scripts
│   ├── setup.sh
│   └── deploy.sh
│
└── README.md
```

## Technology Stack Details

### Mobile App
- **Framework**: React Native 0.72+
- **Language**: TypeScript 5.0+
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation 6+
- **Styling**: Styled Components or React Native StyleSheet
- **Forms**: React Hook Form + Yup
- **HTTP Client**: RTK Query (built-in) or Axios
- **Storage**: AsyncStorage or MMKV
- **Testing**: Jest + React Native Testing Library + Detox

### Backend API
- **Framework**: NestJS 10+
- **Language**: TypeScript 5.0+
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM or Prisma
- **Cache**: Redis
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

### Infrastructure
- **Cloud**: AWS
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + CloudWatch

## Development Workflow

### Setup
1. Clone repository
2. Install dependencies (`npm install` in mobile/ and backend/)
3. Set up environment variables (copy `.env.example` to `.env`)
4. Start local database (Docker Compose)
5. Run migrations
6. Start backend API (`npm run start:dev`)
7. Start mobile app (`npm start`)

### Git Workflow
- **Main branch**: `main` (production-ready code)
- **Development branch**: `develop` (integration branch)
- **Feature branches**: `feature/feature-name`
- **Hotfix branches**: `hotfix/issue-name`

### Code Standards
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Commit Messages**: Conventional Commits
- **Code Reviews**: Required before merging to develop

## Environment Variables

### Mobile (.env)
```
API_BASE_URL=https://api.fastivalle.com
API_VERSION=v1
ENVIRONMENT=development
SENTRY_DSN=
FIREBASE_API_KEY=
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/fastivalle
REDIS_URL=redis://localhost:6379
JWT_SECRET=
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
SENTRY_DSN=
```
