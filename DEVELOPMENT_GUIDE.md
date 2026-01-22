# Fastivalle Development Guide

## Project Status

### Completed ✅
- ✅ Project structure initialized (monorepo with mobile and backend)
- ✅ Backend foundation (NestJS setup, database entities, modules structure)
- ✅ Mobile foundation (React Native setup, Redux store, navigation, theme)
- ✅ Design system (base components: Button, Input, Card, Typography)
- ✅ Database schema (all entities created)
- ✅ API structure (endpoints defined in API_SPECIFICATION.md)
- ✅ Architecture documentation (system architecture diagrams)

### In Progress / Next Steps

#### Backend Implementation
1. **Authentication Module** (`backend/src/modules/auth/`)
   - Implement AuthController, AuthService
   - Create JWT and Local strategies
   - Add password hashing with bcrypt
   - Implement refresh token rotation

2. **Users Module** (`backend/src/modules/users/`)
   - Implement UsersController, UsersService
   - Add user CRUD operations
   - Implement file upload for avatars

3. **Events Module** (`backend/src/modules/events/`)
   - Implement EventsController, EventsService
   - Add event CRUD operations
   - Implement search and filtering
   - Add event image handling

4. **Tickets Module** (`backend/src/modules/tickets/`)
   - Implement TicketsController, TicketsService
   - Add ticket purchase flow
   - Implement QR code generation

5. **Payments Module** (`backend/src/modules/payments/`)
   - Integrate Stripe
   - Implement payment intents
   - Handle webhooks

6. **Notifications Module** (`backend/src/modules/notifications/`)
   - Implement NotificationsController, NotificationsService
   - Integrate Firebase Cloud Messaging
   - Add push notification sending

#### Mobile Implementation
1. **Authentication Screens** (`mobile/src/screens/auth/`)
   - LoginScreen
   - SignUpScreen
   - ForgotPasswordScreen

2. **Events Screens** (`mobile/src/screens/events/`)
   - HomeScreen (event listings)
   - EventDetailScreen
   - SearchScreen
   - FilterScreen

3. **Tickets Screens** (`mobile/src/screens/tickets/`)
   - TicketListScreen
   - TicketDetailScreen
   - CheckoutScreen

4. **Profile Screens** (`mobile/src/screens/profile/`)
   - ProfileScreen
   - EditProfileScreen
   - SettingsScreen

5. **Redux Slices** (`mobile/src/store/slices/`)
   - authSlice
   - eventsSlice
   - ticketsSlice
   - profileSlice

6. **API Services** (`mobile/src/services/api/`)
   - authApi (RTK Query endpoints)
   - eventsApi
   - ticketsApi
   - paymentsApi

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis
- React Native development environment

### Setup

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**
   - Copy `.env.example` files in `backend/` and `mobile/`
   - Configure your environment variables

3. **Start database services**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run migration:run
   ```

5. **Start backend API**
   ```bash
   npm run backend:dev
   ```

6. **Start mobile app**
   ```bash
   npm run mobile:ios
   # or
   npm run mobile:android
   ```

## Development Workflow

### Backend Development

1. Create a new module:
   ```bash
   cd backend
   nest generate module modules/[module-name]
   nest generate controller modules/[module-name]
   nest generate service modules/[module-name]
   ```

2. Create database migrations:
   ```bash
   npm run migration:generate -- -n MigrationName
   npm run migration:run
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Mobile Development

1. Create a new screen:
   ```bash
   # Create screen file in mobile/src/screens/[feature]/[ScreenName].tsx
   ```

2. Create Redux slice:
   ```bash
   # Create slice file in mobile/src/store/slices/[feature]Slice.ts
   ```

3. Add API endpoints:
   ```bash
   # Add RTK Query endpoints in mobile/src/services/api/[feature]Api.ts
   ```

## Code Style

### TypeScript
- Use TypeScript strict mode
- Define types/interfaces for all data structures
- Use type inference where appropriate

### Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`)
- Files: camelCase for utilities, PascalCase for components
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

### File Structure
- One component per file
- Co-locate related files (component + styles + tests)
- Use index.ts for exports

## Testing

### Backend Tests
- Unit tests: `*.spec.ts` files
- E2E tests: `test/` directory
- Run: `npm test`

### Mobile Tests
- Component tests: `__tests__/` directory
- Run: `npm test`

## Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push and create PR: `git push origin feature/feature-name`
4. Merge to `develop` after review
5. Merge `develop` to `main` for releases

## Common Tasks

### Adding a New API Endpoint

1. **Backend:**
   - Add route in controller
   - Implement service method
   - Add DTOs for request/response
   - Add validation

2. **Mobile:**
   - Add RTK Query endpoint
   - Create/update types
   - Use in components/screens

### Adding a New Screen

1. Create screen component
2. Add to navigation
3. Create Redux slice if needed
4. Add API integration
5. Style with theme

### Database Changes

1. Update entity
2. Generate migration: `npm run migration:generate`
3. Review migration file
4. Run migration: `npm run migration:run`

## Troubleshooting

### Backend Issues
- Check database connection in `.env`
- Verify migrations are up to date
- Check logs: `npm run start:dev`

### Mobile Issues
- Clear Metro cache: `npm start -- --reset-cache`
- Reinstall pods (iOS): `cd ios && pod install`
- Clean build (Android): `cd android && ./gradlew clean`

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)

## Next Steps

1. Implement authentication module (backend + mobile)
2. Implement events feature
3. Implement tickets and purchasing
4. Add testing
5. Deploy to staging environment
