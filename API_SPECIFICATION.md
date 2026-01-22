# Fastivalle API Specification

## Base URL
```
Production: https://api.fastivalle.com/api/v1
Staging: https://staging-api.fastivalle.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

### JWT Token Authentication
- Access tokens are short-lived (15-30 minutes)
- Refresh tokens are long-lived (7-30 days)
- Include access token in Authorization header: `Authorization: Bearer <token>`
- Refresh tokens sent via secure HTTP-only cookies or request body

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** Same as register

#### Refresh Token
```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

#### Logout
```
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Social Login (Google/Apple/Facebook)
```
POST /auth/social/{provider}
```

**Request Body:**
```json
{
  "token": "provider-access-token",
  "idToken": "provider-id-token"
}
```

### Users

#### Get Current User
```
GET /users/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": "https://...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Update User Profile
```
PATCH /users/me
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "avatar": "https://..."
}
```

#### Upload Avatar
```
POST /users/me/avatar
```

**Headers:** `Authorization: Bearer <token>`

**Request:** Multipart form data with `file` field

**Response:**
```json
{
  "success": true,
  "data": {
    "avatar": "https://s3.amazonaws.com/..."
  }
}
```

### Events

#### Get Events List
```
GET /events
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `category` (string, optional)
- `location` (string, optional)
- `dateFrom` (ISO date, optional)
- `dateTo` (ISO date, optional)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Event Title",
      "description": "Event description",
      "category": "music",
      "location": {
        "name": "Venue Name",
        "address": "123 Main St",
        "city": "City",
        "country": "Country",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      "startDate": "2024-06-01T18:00:00Z",
      "endDate": "2024-06-01T22:00:00Z",
      "image": "https://...",
      "price": {
        "min": 25.00,
        "max": 100.00,
        "currency": "USD"
      },
      "organizer": {
        "id": "uuid",
        "name": "Organizer Name"
      },
      "ticketCount": {
        "total": 1000,
        "available": 750,
        "sold": 250
      }
    }
  ],
  "pagination": { ... }
}
```

#### Get Event Details
```
GET /events/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Event Title",
    "description": "Full event description...",
    "category": "music",
    "location": { ... },
    "startDate": "2024-06-01T18:00:00Z",
    "endDate": "2024-06-01T22:00:00Z",
    "image": "https://...",
    "gallery": ["https://...", "https://..."],
    "price": { ... },
    "organizer": { ... },
    "ticketCount": { ... },
    "ticketTypes": [
      {
        "id": "uuid",
        "name": "General Admission",
        "price": 25.00,
        "currency": "USD",
        "available": 500,
        "description": "Ticket description"
      }
    ],
    "terms": "Event terms and conditions...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Create Event (Organizer)
```
POST /events
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event description",
  "category": "music",
  "location": {
    "name": "Venue Name",
    "address": "123 Main St",
    "city": "City",
    "country": "Country",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "startDate": "2024-06-01T18:00:00Z",
  "endDate": "2024-06-01T22:00:00Z",
  "ticketTypes": [
    {
      "name": "General Admission",
      "price": 25.00,
      "available": 500,
      "description": "Ticket description"
    }
  ],
  "terms": "Event terms..."
}
```

### Tickets

#### Get User Tickets
```
GET /tickets
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string: "upcoming", "past", "cancelled")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event": {
        "id": "uuid",
        "title": "Event Title",
        "startDate": "2024-06-01T18:00:00Z",
        "image": "https://..."
      },
      "ticketType": {
        "id": "uuid",
        "name": "General Admission",
        "price": 25.00
      },
      "quantity": 2,
      "totalPrice": 50.00,
      "currency": "USD",
      "status": "confirmed",
      "qrCode": "https://...",
      "purchasedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### Purchase Tickets
```
POST /tickets/purchase
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "eventId": "uuid",
  "ticketTypeId": "uuid",
  "quantity": 2,
  "paymentMethodId": "pm_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "tickets": [ ... ],
    "totalAmount": 50.00,
    "currency": "USD",
    "status": "confirmed"
  }
}
```

#### Get Ticket Details
```
GET /tickets/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "event": { ... },
    "ticketType": { ... },
    "quantity": 2,
    "totalPrice": 50.00,
    "status": "confirmed",
    "qrCode": "https://...",
    "attendees": [
      {
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "purchasedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Payments

#### Create Payment Intent
```
POST /payments/intent
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 50.00,
  "currency": "USD",
  "eventId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

#### Confirm Payment
```
POST /payments/confirm
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "orderId": "uuid"
}
```

### Notifications

#### Get Notifications
```
GET /notifications
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `unreadOnly` (boolean)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "event_reminder",
      "title": "Event Reminder",
      "message": "Your event starts in 2 hours",
      "read": false,
      "createdAt": "2024-01-15T10:00:00Z",
      "data": {
        "eventId": "uuid"
      }
    }
  ],
  "pagination": { ... }
}
```

#### Mark Notification as Read
```
PATCH /notifications/:id/read
```

**Headers:** `Authorization: Bearer <token>`

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## Rate Limiting

- **General endpoints**: 100 requests per minute per IP
- **Authentication endpoints**: 5 requests per minute per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Webhooks (if applicable)

### Event Webhooks
- `event.created`
- `event.updated`
- `event.cancelled`
- `ticket.purchased`
- `payment.succeeded`
- `payment.failed`

**Webhook Payload:**
```json
{
  "event": "ticket.purchased",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": { ... }
}
```
