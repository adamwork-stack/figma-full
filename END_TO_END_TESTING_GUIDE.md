# End-to-End Testing Guide

## Overview

This guide covers comprehensive testing of the Fastivalle application, from setup to execution.

## Prerequisites

1. Environment variables configured
2. Database migrations run
3. Backend API running
4. Mobile app dependencies installed

## Step 1: Start All Services

### Terminal 1: Start Database Services

```bash
# From project root
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

### Terminal 2: Start Backend API

```bash
cd backend

# Install dependencies (if not done)
npm install

# Start development server
npm run start:dev

# Expected output:
# Application is running on: http://localhost:3000
# Swagger documentation: http://localhost:3000/api/docs
```

**Verify Backend:**
- Open browser: http://localhost:3000/api/v1/health
- Should return: `{"status":"ok","timestamp":"..."}`
- Open Swagger: http://localhost:3000/api/docs

### Terminal 3: Start Mobile App

#### For iOS (macOS only):

```bash
cd mobile

# Install dependencies
npm install

# Install iOS pods
cd ios
pod install
cd ..

# Start Metro bundler
npm start

# In another terminal, run iOS app
npm run ios
```

#### For Android:

```bash
cd mobile

# Install dependencies
npm install

# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android
```

## Step 2: Backend API Testing

### Test 1: Health Check

```bash
curl http://localhost:3000/api/v1/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### Test 2: User Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected:** Response with user data and tokens

### Test 3: User Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected:** Response with user data and tokens

Save the `accessToken` from response for next tests.

### Test 4: Get Current User (Authenticated)

```bash
# Replace YOUR_ACCESS_TOKEN with token from login
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:** User profile data

### Test 5: Create Event (as Organizer)

```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event",
    "category": "music",
    "startDate": "2024-06-01T18:00:00Z",
    "endDate": "2024-06-01T22:00:00Z",
    "location": {
      "name": "Test Venue",
      "address": "123 Test St",
      "city": "Test City",
      "country": "USA"
    },
    "ticketTypes": [
      {
        "name": "General Admission",
        "price": 25.00,
        "available": 100
      }
    ]
  }'
```

**Expected:** Created event with ID

### Test 6: Get Events List

```bash
curl http://localhost:3000/api/v1/events
```

**Expected:** List of events with pagination

### Test 7: Get Event Details

```bash
# Replace EVENT_ID with ID from created event
curl http://localhost:3000/api/v1/events/EVENT_ID
```

**Expected:** Event details with ticket types

### Test 8: Create Payment Intent

```bash
curl -X POST http://localhost:3000/api/v1/payments/intent \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.00,
    "currency": "USD",
    "eventId": "EVENT_ID"
  }'
```

**Expected:** Payment intent with client secret

### Test 9: Purchase Tickets

```bash
curl -X POST http://localhost:3000/api/v1/tickets/purchase \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVENT_ID",
    "tickets": [
      {
        "ticketTypeId": "TICKET_TYPE_ID",
        "quantity": 2,
        "attendees": [
          {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com"
          },
          {
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "jane@example.com"
          }
        ]
      }
    ],
    "paymentMethodId": "pm_test_123"
  }'
```

**Expected:** Order confirmation with tickets

### Test 10: Get User Tickets

```bash
curl http://localhost:3000/api/v1/tickets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:** List of user's tickets

### Test 11: Get Notifications

```bash
curl http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:** List of notifications

## Step 3: Mobile App Testing

### Test Flow 1: Authentication

1. **Launch App**
   - App should show Login screen

2. **Test Registration**
   - Tap "Sign Up"
   - Fill in form:
     - First Name: Test
     - Last Name: User
     - Email: test@example.com
     - Password: Test123!
     - Confirm Password: Test123!
   - Tap "Sign Up"
   - Should navigate to main app

3. **Test Login**
   - Logout (if logged in)
   - Enter credentials:
     - Email: test@example.com
     - Password: Test123!
   - Tap "Sign In"
   - Should navigate to main app

4. **Test Forgot Password**
   - Tap "Forgot Password?"
   - Enter email
   - Tap "Send Reset Instructions"
   - Should show success message

### Test Flow 2: Events

1. **Browse Events**
   - Navigate to Events tab
   - Should see list of events
   - Pull down to refresh
   - Scroll to test pagination

2. **View Event Details**
   - Tap on an event
   - Should show event details:
     - Title, description
     - Date and location
     - Ticket types and prices
   - Tap "Buy Tickets"
   - Should navigate to checkout

3. **Search Events**
   - Tap search icon
   - Enter search term
   - Should filter events

### Test Flow 3: Ticket Purchase

1. **Select Tickets**
   - From event detail, tap "Buy Tickets"
   - Select ticket type
   - Enter quantity
   - Review order summary
   - Tap "Complete Purchase"

2. **Payment Flow**
   - Enter payment information (test card)
   - Complete payment
   - Should show order confirmation

3. **View Tickets**
   - Navigate to Tickets tab
   - Should see purchased tickets
   - Tap on a ticket
   - Should show ticket details with QR code

### Test Flow 4: Profile

1. **View Profile**
   - Navigate to Profile tab
   - Should show user information

2. **Edit Profile**
   - Tap "Edit Profile"
   - Update information
   - Tap "Save Changes"
   - Should update and return to profile

3. **Settings**
   - Tap "Settings"
   - Toggle notification preferences
   - Changes should persist

4. **Logout**
   - Tap "Logout"
   - Should return to login screen

### Test Flow 5: Notifications

1. **View Notifications**
   - Navigate to Notifications (from Profile)
   - Should show notification list

2. **Mark as Read**
   - Tap on unread notification
   - Should mark as read

3. **Mark All Read**
   - Tap "Mark All Read"
   - All notifications should be marked read

## Step 4: Automated Testing

### Backend Unit Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run specific test file
npm test -- auth.service.spec.ts

# Watch mode
npm run test:watch
```

### Backend E2E Tests

```bash
cd backend

# Start test database first
docker-compose -f docker-compose.test.yml up -d

# Run E2E tests
npm run test:e2e
```

### Mobile Unit Tests

```bash
cd mobile

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Mobile Component Tests

```bash
cd mobile

# Run component tests
npm test -- Button.test.tsx
```

## Step 5: Integration Testing

### Test API Integration from Mobile

1. **Enable Network Logging**
   - Use React Native Debugger
   - Enable network inspection
   - Monitor API calls

2. **Test Token Refresh**
   - Let access token expire
   - Make API call
   - Should automatically refresh token
   - Should retry original request

3. **Test Offline Handling**
   - Turn off network
   - Try to make API call
   - Should handle gracefully
   - Turn network back on
   - Should sync data

## Step 6: Performance Testing

### Backend Performance

```bash
# Install Apache Bench (ab) or use Postman
# Test API response times

# Example with curl timing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/v1/events

# Create curl-format.txt:
# time_namelookup:  %{time_namelookup}\n
# time_connect:  %{time_connect}\n
# time_starttransfer:  %{time_starttransfer}\n
# time_total:  %{time_total}\n
```

### Mobile Performance

1. **Use React Native Performance Monitor**
   - Enable in development menu
   - Monitor FPS
   - Check memory usage

2. **Test on Real Devices**
   - Test on actual iOS device
   - Test on actual Android device
   - Compare performance

3. **Profile App**
   - Use React DevTools Profiler
   - Identify slow components
   - Optimize bottlenecks

## Step 7: Security Testing

### Test Authentication

1. **Test Invalid Credentials**
   - Try login with wrong password
   - Should show error
   - Should not expose user existence

2. **Test Token Expiration**
   - Use expired token
   - Should return 401
   - Should trigger refresh

3. **Test Authorization**
   - Try to access protected endpoint without token
   - Should return 401
   - Try to access other user's data
   - Should return 403

### Test Input Validation

1. **Test SQL Injection**
   - Try SQL in search query
   - Should be sanitized

2. **Test XSS**
   - Try script tags in input
   - Should be sanitized

3. **Test Rate Limiting**
   - Make many rapid requests
   - Should be rate limited

## Step 8: Manual QA Checklist

### Functionality Testing

- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] User can view events
- [ ] User can search events
- [ ] User can view event details
- [ ] User can purchase tickets
- [ ] User can view tickets
- [ ] User can view ticket QR code
- [ ] User can edit profile
- [ ] User can view notifications
- [ ] User can mark notifications as read

### UI/UX Testing

- [ ] All screens render correctly
- [ ] Navigation works smoothly
- [ ] Forms validate input
- [ ] Error messages are clear
- [ ] Loading states display
- [ ] Empty states display
- [ ] Pull-to-refresh works
- [ ] Infinite scroll works

### Platform Testing

- [ ] iOS: Test on iPhone (various sizes)
- [ ] iOS: Test on iPad
- [ ] Android: Test on various screen sizes
- [ ] Android: Test on different Android versions
- [ ] Test on both platforms simultaneously

### Edge Cases

- [ ] No internet connection
- [ ] Slow internet connection
- [ ] App backgrounded during operation
- [ ] App killed and restarted
- [ ] Token expired during use
- [ ] Large data sets
- [ ] Special characters in input
- [ ] Very long text inputs

## Step 9: Bug Reporting

When you find issues, document:

1. **Steps to Reproduce**
   - What you were doing
   - What you expected
   - What actually happened

2. **Environment**
   - Device/OS version
   - App version
   - Backend version

3. **Screenshots/Logs**
   - Screenshot of issue
   - Console logs
   - Network requests

## Step 10: Test Data Cleanup

After testing:

```bash
# Reset database (development only!)
cd backend

# Drop and recreate database
psql -U postgres -c "DROP DATABASE fastivalle;"
psql -U postgres -c "CREATE DATABASE fastivalle;"

# Run migrations again
npm run migration:run

# Or use seed script
npm run seed:run
```

## Next Steps

After successful testing:
1. Document any issues found
2. Fix critical bugs
3. Proceed to staging deployment
4. Continue testing on staging environment
