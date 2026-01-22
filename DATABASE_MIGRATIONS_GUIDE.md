# Database Migrations Guide

## Overview

This guide covers setting up and running database migrations for the Fastivalle application using TypeORM.

## Prerequisites

1. PostgreSQL installed and running
2. Database created
3. Environment variables configured

## Step-by-Step Instructions

### Step 1: Start Database Services

#### Option A: Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d

# Verify containers are running
docker-compose ps

# Check logs if needed
docker-compose logs postgres
```

#### Option B: Manual PostgreSQL Setup

```bash
# Create database
createdb fastivalle

# Or using psql
psql -U postgres
CREATE DATABASE fastivalle;
CREATE USER fastivalle WITH PASSWORD 'fastivalle';
GRANT ALL PRIVILEGES ON DATABASE fastivalle TO fastivalle;
\q
```

### Step 2: Verify Database Connection

Test the connection:

```bash
cd backend

# Using psql
psql -h localhost -U fastivalle -d fastivalle

# Or test from Node.js
node -e "const {Client} = require('pg'); const client = new Client({host:'localhost',user:'fastivalle',password:'fastivalle',database:'fastivalle'}); client.connect().then(() => console.log('Connected!')).catch(e => console.error(e));"
```

### Step 3: Configure TypeORM for Migrations

#### Update backend/package.json

Add migration scripts (if not already present):

```json
{
  "scripts": {
    "migration:generate": "typeorm migration:generate -d src/database/data-source.ts",
    "migration:create": "typeorm migration:create",
    "migration:run": "typeorm migration:run -d src/database/data-source.ts",
    "migration:revert": "typeorm migration:revert -d src/database/data-source.ts",
    "migration:show": "typeorm migration:show -d src/database/data-source.ts"
  }
}
```

#### Create Data Source Configuration

Create `backend/src/database/data-source.ts`:

```typescript
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'fastivalle'),
  password: configService.get('DB_PASSWORD', 'fastivalle'),
  database: configService.get('DB_DATABASE', 'fastivalle'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Never use synchronize in production!
  logging: true,
});
```

### Step 4: Generate Initial Migration

```bash
cd backend

# Generate migration from entities
npm run migration:generate -- src/database/migrations/InitialMigration

# This will create a file like: src/database/migrations/1234567890-InitialMigration.ts
```

**Note:** The migration file will contain SQL to create all tables based on your entities.

### Step 5: Review Migration File

Open the generated migration file and review it:

```typescript
// Example: src/database/migrations/1234567890-InitialMigration.ts
export class InitialMigration1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Creates tables
    await queryRunner.query(`CREATE TABLE "users" ...`);
    // ... etc
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drops tables (for rollback)
    await queryRunner.query(`DROP TABLE "users"`);
    // ... etc
  }
}
```

### Step 6: Run Migrations

```bash
cd backend

# Run all pending migrations
npm run migration:run

# Check migration status
npm run migration:show
```

**Expected Output:**
```
Migration InitialMigration1234567890 has been executed successfully.
```

### Step 7: Verify Tables Created

Connect to database and verify:

```bash
psql -h localhost -U fastivalle -d fastivalle

# List tables
\dt

# Check a specific table structure
\d users

# Check table data
SELECT COUNT(*) FROM users;

# Exit
\q
```

You should see these tables:
- users
- events
- ticket_types
- tickets
- ticket_attendees
- orders
- payments
- notifications
- event_images
- refresh_tokens (if implemented)

### Step 8: Create Seed Data (Optional)

Create `backend/src/database/seeds/initial-seed.ts`:

```typescript
import { DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedInitialData(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = userRepository.create({
    email: 'admin@fastivalle.com',
    passwordHash: adminPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    emailVerified: true,
    isActive: true,
  });

  await userRepository.save(admin);
  console.log('Admin user created:', admin.email);
}
```

Add seed script to `backend/package.json`:

```json
{
  "scripts": {
    "seed:run": "ts-node src/database/seeds/run-seeds.ts"
  }
}
```

### Step 9: Handling Migration Issues

#### Issue: Migration Already Executed

If you see "Migration Already Executed" error:

```bash
# Check migration status
npm run migration:show

# If needed, manually mark as executed in database
psql -h localhost -U fastivalle -d fastivalle
INSERT INTO migrations (timestamp, name) VALUES (1234567890, 'InitialMigration1234567890');
```

#### Issue: Migration Failed Midway

```bash
# Revert last migration
npm run migration:revert

# Fix the issue
# Regenerate or fix migration file

# Run again
npm run migration:run
```

#### Issue: Database Schema Out of Sync

If entities changed but migrations weren't created:

```bash
# Generate new migration
npm run migration:generate -- src/database/migrations/UpdateSchema

# Review and run
npm run migration:run
```

### Step 10: Production Migrations

**Important:** For production:

1. **Always backup database first:**
   ```bash
   pg_dump -h localhost -U fastivalle fastivalle > backup.sql
   ```

2. **Test migrations on staging first**

3. **Run migrations during maintenance window**

4. **Have rollback plan ready**

5. **Monitor migration execution**

### Step 11: Migration Best Practices

1. **Never modify executed migrations**
   - Create new migration instead
   - Migrations are immutable once executed

2. **Always test migrations**
   - Test on development database first
   - Test rollback (migration:revert)

3. **Keep migrations small**
   - One logical change per migration
   - Easier to debug and rollback

4. **Document complex migrations**
   - Add comments explaining why
   - Document data transformations

5. **Version control migrations**
   - Commit migration files to Git
   - Never delete migration files

### Step 12: Automated Migration Script

Create `backend/scripts/migrate.sh`:

```bash
#!/bin/bash

echo "Running database migrations..."

# Run migrations
npm run migration:run

if [ $? -eq 0 ]; then
    echo "Migrations completed successfully!"
else
    echo "Migration failed!"
    exit 1
fi
```

Or `backend/scripts/migrate.ps1`:

```powershell
Write-Host "Running database migrations..."

npm run migration:run

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migrations completed successfully!"
} else {
    Write-Host "Migration failed!"
    exit 1
}
```

## Migration Workflow

### Development Workflow

1. Make changes to entities
2. Generate migration: `npm run migration:generate`
3. Review migration file
4. Run migration: `npm run migration:run`
5. Test application
6. Commit migration file

### Production Workflow

1. Backup production database
2. Test migration on staging
3. Schedule maintenance window
4. Run migration: `npm run migration:run`
5. Verify migration success
6. Monitor application
7. If issues: Rollback with `npm run migration:revert`

## Troubleshooting

### Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U fastivalle -d fastivalle -c "SELECT version();"

# Check if database exists
psql -h localhost -U postgres -l | grep fastivalle

# Check user permissions
psql -h localhost -U postgres -d fastivalle -c "\du fastivalle"
```

### Migration Lock Issues

If migrations are locked:

```bash
# Check for locks
psql -h localhost -U fastivalle -d fastivalle -c "SELECT * FROM pg_locks WHERE relation = 'migrations'::regclass;"

# If needed, manually unlock (be careful!)
# Only do this if you're sure no migration is running
```

### Rollback Strategy

Always test rollback:

```bash
# Revert last migration
npm run migration:revert

# Verify rollback
npm run migration:show

# Check database state
psql -h localhost -U fastivalle -d fastivalle -c "\dt"
```

## Next Steps

After migrations are complete:
1. Verify all tables exist
2. Run seed data (if applicable)
3. Test database connections from application
4. Proceed to application testing
