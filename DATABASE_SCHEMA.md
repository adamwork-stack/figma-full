# Fastivalle Database Schema

## Overview

This document outlines the database schema for the Fastivalle application. The schema is designed for PostgreSQL and uses TypeORM/Prisma for ORM management.

## Entity Relationship Diagram (Text Representation)

```
Users ──┬── Tickets ── Event
        ├── Notifications
        ├── PaymentMethods
        └── OrganizerProfile (if organizer)

Events ──┬── Tickets
         ├── TicketTypes
         ├── EventImages
         └── OrganizerProfile

Tickets ── TicketAttendees
```

## Tables

### users

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | User unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| phone | VARCHAR(20) | NULLABLE | Phone number |
| avatar_url | VARCHAR(500) | NULLABLE | Profile picture URL |
| email_verified | BOOLEAN | DEFAULT false | Email verification status |
| phone_verified | BOOLEAN | DEFAULT false | Phone verification status |
| role | ENUM | DEFAULT 'user' | User role (user, organizer, admin) |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| last_login_at | TIMESTAMP | NULLABLE | Last login timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_role` on `role`

### events

Stores event information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Event unique identifier |
| organizer_id | UUID | FOREIGN KEY → users.id | Event organizer |
| title | VARCHAR(255) | NOT NULL | Event title |
| description | TEXT | NOT NULL | Event description |
| category | VARCHAR(50) | NOT NULL | Event category |
| start_date | TIMESTAMP | NOT NULL | Event start date/time |
| end_date | TIMESTAMP | NOT NULL | Event end date/time |
| location_name | VARCHAR(255) | NOT NULL | Venue name |
| location_address | VARCHAR(500) | NOT NULL | Street address |
| location_city | VARCHAR(100) | NOT NULL | City |
| location_country | VARCHAR(100) | NOT NULL | Country |
| location_latitude | DECIMAL(10, 8) | NULLABLE | Latitude coordinate |
| location_longitude | DECIMAL(11, 8) | NULLABLE | Longitude coordinate |
| image_url | VARCHAR(500) | NULLABLE | Main event image |
| terms | TEXT | NULLABLE | Terms and conditions |
| status | ENUM | DEFAULT 'draft' | Event status (draft, published, cancelled, completed) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Event creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_events_organizer` on `organizer_id`
- `idx_events_category` on `category`
- `idx_events_start_date` on `start_date`
- `idx_events_status` on `status`
- `idx_events_location` on `location_city, location_country`

### ticket_types

Stores different ticket types for events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Ticket type unique identifier |
| event_id | UUID | FOREIGN KEY → events.id | Associated event |
| name | VARCHAR(255) | NOT NULL | Ticket type name |
| description | TEXT | NULLABLE | Ticket type description |
| price | DECIMAL(10, 2) | NOT NULL | Ticket price |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'USD' | Currency code |
| quantity_total | INTEGER | NOT NULL | Total tickets available |
| quantity_sold | INTEGER | DEFAULT 0 | Tickets sold count |
| sale_start_date | TIMESTAMP | NULLABLE | When sales start |
| sale_end_date | TIMESTAMP | NULLABLE | When sales end |
| is_active | BOOLEAN | DEFAULT true | Ticket type active status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_ticket_types_event` on `event_id`
- `idx_ticket_types_active` on `is_active`

### tickets

Stores individual ticket purchases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Ticket unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Ticket purchaser |
| event_id | UUID | FOREIGN KEY → events.id | Associated event |
| ticket_type_id | UUID | FOREIGN KEY → ticket_types.id | Ticket type |
| order_id | UUID | NOT NULL | Order identifier (for grouping) |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Number of tickets |
| unit_price | DECIMAL(10, 2) | NOT NULL | Price per ticket |
| total_price | DECIMAL(10, 2) | NOT NULL | Total amount paid |
| currency | VARCHAR(3) | NOT NULL | Currency code |
| status | ENUM | DEFAULT 'pending' | Ticket status (pending, confirmed, cancelled, refunded) |
| qr_code | VARCHAR(500) | NULLABLE | QR code URL/image |
| checked_in | BOOLEAN | DEFAULT false | Check-in status |
| checked_in_at | TIMESTAMP | NULLABLE | Check-in timestamp |
| purchased_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Purchase timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_tickets_user` on `user_id`
- `idx_tickets_event` on `event_id`
- `idx_tickets_order` on `order_id`
- `idx_tickets_status` on `status`

### ticket_attendees

Stores attendee information for each ticket.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Attendee unique identifier |
| ticket_id | UUID | FOREIGN KEY → tickets.id | Associated ticket |
| first_name | VARCHAR(100) | NOT NULL | Attendee first name |
| last_name | VARCHAR(100) | NOT NULL | Attendee last name |
| email | VARCHAR(255) | NULLABLE | Attendee email |
| phone | VARCHAR(20) | NULLABLE | Attendee phone |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_ticket_attendees_ticket` on `ticket_id`

### orders

Stores order/purchase information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Order unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Order purchaser |
| total_amount | DECIMAL(10, 2) | NOT NULL | Total order amount |
| currency | VARCHAR(3) | NOT NULL | Currency code |
| payment_intent_id | VARCHAR(255) | NULLABLE | Stripe payment intent ID |
| payment_status | ENUM | DEFAULT 'pending' | Payment status (pending, succeeded, failed, refunded) |
| status | ENUM | DEFAULT 'pending' | Order status (pending, confirmed, cancelled) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Order creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_orders_user` on `user_id`
- `idx_orders_payment_intent` on `payment_intent_id`
- `idx_orders_status` on `status`

### payments

Stores payment transaction records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Payment unique identifier |
| order_id | UUID | FOREIGN KEY → orders.id | Associated order |
| user_id | UUID | FOREIGN KEY → users.id | Payer |
| amount | DECIMAL(10, 2) | NOT NULL | Payment amount |
| currency | VARCHAR(3) | NOT NULL | Currency code |
| payment_method | VARCHAR(50) | NOT NULL | Payment method (stripe, etc.) |
| payment_intent_id | VARCHAR(255) | NULLABLE | External payment ID |
| status | ENUM | NOT NULL | Payment status (pending, succeeded, failed, refunded) |
| failure_reason | TEXT | NULLABLE | Failure reason if failed |
| processed_at | TIMESTAMP | NULLABLE | Payment processing time |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_payments_order` on `order_id`
- `idx_payments_user` on `user_id`
- `idx_payments_status` on `status`

### notifications

Stores user notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Notification unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Notification recipient |
| type | VARCHAR(50) | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| data | JSONB | NULLABLE | Additional notification data |
| read | BOOLEAN | DEFAULT false | Read status |
| read_at | TIMESTAMP | NULLABLE | Read timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_notifications_user` on `user_id`
- `idx_notifications_read` on `read`
- `idx_notifications_created` on `created_at`

### event_images

Stores additional event images (gallery).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Image unique identifier |
| event_id | UUID | FOREIGN KEY → events.id | Associated event |
| image_url | VARCHAR(500) | NOT NULL | Image URL |
| order | INTEGER | DEFAULT 0 | Display order |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_event_images_event` on `event_id`

### refresh_tokens

Stores refresh tokens for authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Token unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Token owner |
| token | VARCHAR(500) | NOT NULL, UNIQUE | Refresh token |
| expires_at | TIMESTAMP | NOT NULL | Token expiration time |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_refresh_tokens_user` on `user_id`
- `idx_refresh_tokens_token` on `token`
- `idx_refresh_tokens_expires` on `expires_at`

## Enums

### User Role
- `user` - Regular user
- `organizer` - Event organizer
- `admin` - System administrator

### Event Status
- `draft` - Event not yet published
- `published` - Event is live and visible
- `cancelled` - Event cancelled
- `completed` - Event has ended

### Ticket Status
- `pending` - Payment pending
- `confirmed` - Ticket confirmed and valid
- `cancelled` - Ticket cancelled
- `refunded` - Ticket refunded

### Payment Status
- `pending` - Payment processing
- `succeeded` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### Order Status
- `pending` - Order pending
- `confirmed` - Order confirmed
- `cancelled` - Order cancelled

## Relationships

- **Users → Tickets**: One-to-Many (user can have many tickets)
- **Users → Orders**: One-to-Many (user can have many orders)
- **Users → Notifications**: One-to-Many (user can have many notifications)
- **Events → Ticket Types**: One-to-Many (event can have many ticket types)
- **Events → Tickets**: One-to-Many (event can have many tickets)
- **Events → Event Images**: One-to-Many (event can have many images)
- **Ticket Types → Tickets**: One-to-Many (ticket type can have many tickets)
- **Tickets → Ticket Attendees**: One-to-Many (ticket can have many attendees)
- **Orders → Tickets**: One-to-Many (order can contain many tickets)
- **Orders → Payments**: One-to-Many (order can have multiple payment attempts)

## Migration Strategy

1. Create base tables (users, events)
2. Create related tables (ticket_types, tickets)
3. Create supporting tables (orders, payments, notifications)
4. Add indexes for performance
5. Add constraints and foreign keys
6. Seed initial data (categories, admin user)

## Performance Considerations

- Use database indexes on frequently queried columns
- Consider partitioning for large tables (tickets, notifications)
- Implement soft deletes where appropriate
- Use connection pooling
- Consider read replicas for read-heavy operations
- Archive old data (completed events, old notifications)
