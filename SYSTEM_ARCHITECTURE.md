# Fastivalle System Architecture

## Overview

This document describes the system architecture for the Fastivalle mobile application, including the frontend mobile app, backend API, database, and infrastructure components.

## High-Level Architecture

```mermaid
graph TB
    subgraph Client["Mobile App (React Native)"]
        iOS[iOS App]
        Android[Android App]
    end
    
    subgraph API["Backend API (NestJS)"]
        Auth[Authentication Service]
        Events[Events Service]
        Tickets[Tickets Service]
        Payments[Payments Service]
        Notifications[Notifications Service]
        Users[Users Service]
    end
    
    subgraph Database["Database Layer"]
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis Cache)]
    end
    
    subgraph Storage["Storage & CDN"]
        S3[AWS S3]
        CloudFront[CloudFront CDN]
    end
    
    subgraph External["External Services"]
        Stripe[Stripe Payments]
        FCM[Firebase Cloud Messaging]
        APNS[Apple Push Notification Service]
        SocialAuth[Social Auth Providers]
    end
    
    iOS --> API
    Android --> API
    API --> PostgreSQL
    API --> Redis
    API --> S3
    S3 --> CloudFront
    API --> Stripe
    API --> FCM
    API --> APNS
    API --> SocialAuth
    FCM --> Android
    APNS --> iOS
```

## Component Architecture

### Mobile App Architecture

```mermaid
graph TB
    subgraph MobileApp["React Native Mobile App"]
        subgraph Presentation["Presentation Layer"]
            Screens[Screens]
            Components[Components]
            Navigation[Navigation]
        end
        
        subgraph State["State Management"]
            ReduxStore[Redux Store]
            RTKQuery[RTK Query API]
        end
        
        subgraph Services["Services Layer"]
            APIClient[API Client]
            AuthService[Auth Service]
            StorageService[Storage Service]
            NotificationService[Notification Service]
        end
        
        subgraph Utils["Utilities"]
            Formatters[Formatters]
            Validators[Validators]
            Helpers[Helpers]
        end
    end
    
    Screens --> Components
    Screens --> Navigation
    Components --> ReduxStore
    Screens --> ReduxStore
    ReduxStore --> RTKQuery
    RTKQuery --> APIClient
    APIClient --> BackendAPI[Backend API]
    AuthService --> SecureStorage[Secure Storage]
    NotificationService --> FCM[FCM/APNS]
```

### Backend API Architecture

```mermaid
graph TB
    subgraph Backend["NestJS Backend"]
        subgraph Controllers["Controllers Layer"]
            AuthController[Auth Controller]
            EventsController[Events Controller]
            TicketsController[Tickets Controller]
            PaymentsController[Payments Controller]
            UsersController[Users Controller]
        end
        
        subgraph Services["Services Layer"]
            AuthService[Auth Service]
            EventsService[Events Service]
            TicketsService[Tickets Service]
            PaymentsService[Payments Service]
            UsersService[Users Service]
            NotificationService[Notification Service]
        end
        
        subgraph Data["Data Access Layer"]
            Repositories[Repositories]
            Entities[Entities]
            Migrations[Migrations]
        end
        
        subgraph Middleware["Middleware"]
            AuthGuard[Auth Guard]
            ValidationPipe[Validation Pipe]
            ErrorFilter[Exception Filter]
            RateLimiter[Rate Limiter]
        end
    end
    
    Controllers --> Services
    Services --> Repositories
    Repositories --> Database[(PostgreSQL)]
    Services --> Cache[(Redis)]
    AuthGuard --> Controllers
    ValidationPipe --> Controllers
    ErrorFilter --> Controllers
    RateLimiter --> Controllers
```

## Data Flow Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    participant Mobile as Mobile App
    participant API as Backend API
    participant DB as PostgreSQL
    participant Redis as Redis Cache
    
    Mobile->>API: POST /auth/login (email, password)
    API->>DB: Query user by email
    DB-->>API: User data
    API->>API: Verify password hash
    API->>API: Generate JWT tokens
    API->>Redis: Store refresh token
    API-->>Mobile: Access token + Refresh token
    Mobile->>Mobile: Store tokens securely
```

### Event Purchase Flow

```mermaid
sequenceDiagram
    participant Mobile as Mobile App
    participant API as Backend API
    participant DB as PostgreSQL
    participant Stripe as Stripe API
    participant S3 as AWS S3
    
    Mobile->>API: GET /events/:id
    API->>DB: Fetch event details
    DB-->>API: Event data
    API-->>Mobile: Event details
    
    Mobile->>API: POST /tickets/purchase
    API->>DB: Check ticket availability
    API->>DB: Reserve tickets
    API->>Stripe: Create payment intent
    Stripe-->>API: Payment intent client secret
    API-->>Mobile: Payment intent
    
    Mobile->>Stripe: Confirm payment (client-side)
    Stripe-->>Mobile: Payment success
    
    Mobile->>API: POST /payments/confirm
    API->>DB: Create order and tickets
    API->>API: Generate QR codes
    API->>S3: Upload QR codes
    API->>DB: Update ticket availability
    API-->>Mobile: Order confirmation with tickets
```

### Push Notification Flow

```mermaid
sequenceDiagram
    participant Backend as Backend API
    participant FCM as Firebase Cloud Messaging
    participant APNS as Apple Push Notification Service
    participant Mobile as Mobile App
    
    Backend->>Backend: Event reminder scheduled
    Backend->>FCM: Send notification (Android)
    Backend->>APNS: Send notification (iOS)
    FCM->>Mobile: Push notification (Android)
    APNS->>Mobile: Push notification (iOS)
    Mobile->>Mobile: Display notification
    Mobile->>Mobile: Handle deep link
```

## Database Schema Relationships

```mermaid
erDiagram
    USERS ||--o{ TICKETS : purchases
    USERS ||--o{ ORDERS : places
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ EVENTS : organizes
    
    EVENTS ||--o{ TICKET_TYPES : has
    EVENTS ||--o{ TICKETS : contains
    EVENTS ||--o{ EVENT_IMAGES : has
    
    TICKET_TYPES ||--o{ TICKETS : generates
    TICKETS ||--o{ TICKET_ATTENDEES : has
    TICKETS }o--|| ORDERS : belongs_to
    
    ORDERS ||--o{ PAYMENTS : has
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        string avatar_url
        enum role
        timestamp created_at
    }
    
    EVENTS {
        uuid id PK
        uuid organizer_id FK
        string title
        text description
        string category
        timestamp start_date
        timestamp end_date
        string location_name
        string location_address
        decimal location_latitude
        decimal location_longitude
        string image_url
        enum status
        timestamp created_at
    }
    
    TICKET_TYPES {
        uuid id PK
        uuid event_id FK
        string name
        decimal price
        int quantity_total
        int quantity_sold
        boolean is_active
    }
    
    TICKETS {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        uuid ticket_type_id FK
        uuid order_id
        int quantity
        decimal total_price
        enum status
        string qr_code
        timestamp purchased_at
    }
    
    ORDERS {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        enum status
        string payment_intent_id
        timestamp created_at
    }
    
    PAYMENTS {
        uuid id PK
        uuid order_id FK
        uuid user_id FK
        decimal amount
        enum status
        string payment_intent_id
        timestamp processed_at
    }
    
    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type
        string title
        text message
        jsonb data
        boolean read
        timestamp created_at
    }
```

## Infrastructure Architecture

```mermaid
graph TB
    subgraph AWS["AWS Cloud"]
        subgraph Compute["Compute"]
            ECS[ECS/Fargate<br/>Backend API]
            Lambda[Lambda Functions<br/>Background Jobs]
        end
        
        subgraph Database["Database"]
            RDS[(RDS PostgreSQL)]
            ElastiCache[(ElastiCache Redis)]
        end
        
        subgraph Storage["Storage"]
            S3[S3 Buckets<br/>Media Storage]
            CloudFront[CloudFront CDN]
        end
        
        subgraph Monitoring["Monitoring"]
            CloudWatch[CloudWatch<br/>Logs & Metrics]
            XRay[X-Ray<br/>Tracing]
        end
    end
    
    subgraph CI["CI/CD"]
        GitHub[GitHub Actions]
        Fastlane[Fastlane<br/>Mobile Builds]
    end
    
    subgraph External["External Services"]
        Stripe[Stripe]
        Firebase[Firebase]
        Sentry[Sentry]
    end
    
    GitHub --> ECS
    GitHub --> Fastlane
    ECS --> RDS
    ECS --> ElastiCache
    ECS --> S3
    S3 --> CloudFront
    ECS --> Stripe
    ECS --> Firebase
    ECS --> Sentry
    ECS --> CloudWatch
    ECS --> XRay
```

## Security Architecture

```mermaid
graph TB
    subgraph Security["Security Layers"]
        subgraph Network["Network Security"]
            HTTPS[HTTPS/TLS]
            WAF[WAF Rules]
            VPC[VPC Isolation]
        end
        
        subgraph Auth["Authentication & Authorization"]
            JWT[JWT Tokens]
            RefreshTokens[Refresh Tokens]
            RBAC[Role-Based Access Control]
        end
        
        subgraph Data["Data Security"]
            Encryption[Encryption at Rest]
            TransitEncryption[Encryption in Transit]
            SecureStorage[Secure Token Storage]
        end
        
        subgraph API["API Security"]
            RateLimit[Rate Limiting]
            Validation[Input Validation]
            CORS[CORS Policy]
        end
    end
    
    MobileApp[Mobile App] --> HTTPS
    HTTPS --> WAF
    WAF --> VPC
    VPC --> JWT
    JWT --> RBAC
    Data --> Encryption
    Data --> TransitEncryption
    MobileApp --> SecureStorage
    API --> RateLimit
    API --> Validation
    API --> CORS
```

## Deployment Architecture

### Development Environment
- Local PostgreSQL database
- Local Redis instance
- Backend API running locally (port 3000)
- Mobile app connecting to localhost API

### Staging Environment
- AWS ECS Fargate (1 task)
- RDS PostgreSQL (db.t3.micro)
- ElastiCache Redis (cache.t3.micro)
- S3 bucket for media
- CloudFront distribution
- GitHub Actions CI/CD

### Production Environment
- AWS ECS Fargate (auto-scaling, 2-10 tasks)
- RDS PostgreSQL (db.t3.medium, Multi-AZ)
- ElastiCache Redis (cache.t3.medium, cluster mode)
- S3 bucket with versioning
- CloudFront CDN with caching
- AWS WAF for DDoS protection
- Monitoring and alerting

## Technology Stack

### Frontend (Mobile)
- **Framework**: React Native 0.72+
- **Language**: TypeScript 5.0+
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation 6+
- **Styling**: Styled Components
- **Forms**: React Hook Form + Yup
- **HTTP Client**: RTK Query
- **Storage**: AsyncStorage / MMKV
- **Notifications**: React Native Firebase

### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript 5.0+
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM
- **Cache**: Redis
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston

### Infrastructure
- **Cloud Provider**: AWS
- **Compute**: ECS Fargate
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3 + CloudFront
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch, Sentry
- **Error Tracking**: Sentry

### Third-Party Services
- **Payments**: Stripe
- **Push Notifications**: Firebase Cloud Messaging + APNS
- **Analytics**: Mixpanel/Amplitude
- **Email**: SendGrid/AWS SES

## Scalability Considerations

### Horizontal Scaling
- Backend API can scale horizontally (stateless)
- Database read replicas for read-heavy operations
- Redis cluster for distributed caching
- CDN for static asset delivery

### Vertical Scaling
- Database instance size can be increased
- Redis memory can be increased
- ECS task CPU/memory can be adjusted

### Performance Optimization
- Database query optimization with indexes
- API response caching in Redis
- Image optimization and CDN delivery
- Code splitting in mobile app
- Lazy loading of components

## Disaster Recovery

### Backup Strategy
- Database automated backups (daily, 7-day retention)
- S3 versioning enabled
- Infrastructure as Code (Terraform) for quick recovery

### Recovery Procedures
- Database point-in-time recovery
- Infrastructure recreation from Terraform
- Application deployment from Git repository

## Monitoring & Observability

### Metrics
- API response times
- Error rates
- Database query performance
- Cache hit rates
- Mobile app crash rates
- User engagement metrics

### Logging
- Structured logging (JSON format)
- Centralized log aggregation (CloudWatch)
- Log retention: 30 days

### Alerting
- Error rate thresholds
- Response time thresholds
- Database connection issues
- Payment processing failures
- High memory/CPU usage

---

This architecture is designed to be scalable, maintainable, and secure, supporting the Fastivalle mobile application from MVP through production scale.
