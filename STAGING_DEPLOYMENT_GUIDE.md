# Staging Deployment Guide

## Overview

This guide covers deploying the Fastivalle application to a staging environment on AWS.

## Prerequisites

1. AWS account with appropriate permissions
2. AWS CLI installed and configured
3. Terraform installed
4. Docker installed
5. Domain name (optional, can use AWS-provided)

## Step 1: AWS Account Setup

### Create AWS Account

1. Sign up at https://aws.amazon.com/
2. Complete account verification
3. Set up billing alerts

### Configure AWS CLI

```bash
# Install AWS CLI (if not installed)
# Windows: Download from AWS website
# Mac: brew install awscli
# Linux: sudo apt install awscli

# Configure credentials
aws configure

# Enter:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

### Create IAM User for Deployment

1. Go to AWS Console → IAM → Users
2. Create new user: `fastivalle-deployer`
3. Attach policies:
   - `AmazonEC2FullAccess`
   - `AmazonRDSFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonElastiCacheFullAccess`
   - `CloudFrontFullAccess`
   - `IAMFullAccess` (for Terraform)
4. Create access keys
5. Save credentials securely

## Step 2: Terraform Infrastructure Setup

### Step 1: Configure Terraform Variables

Edit `infrastructure/terraform/terraform.tfvars`:

```hcl
aws_region     = "us-east-1"
environment    = "staging"
project_name   = "fastivalle"

db_instance_class = "db.t3.micro"
db_username       = "fastivalle_admin"
db_password       = "CHANGE_THIS_STRONG_PASSWORD"

redis_node_type = "cache.t3.micro"
```

**Generate Strong Passwords:**

```bash
# Generate database password
openssl rand -base64 32

# Save passwords securely (use password manager)
```

### Step 2: Initialize Terraform

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# If plan looks good, apply
terraform apply

# Type 'yes' to confirm
```

**Expected Output:**
- VPC created
- Subnets created
- RDS instance created
- ElastiCache Redis created
- S3 bucket created
- CloudFront distribution created
- Security groups created

### Step 3: Save Terraform Outputs

```bash
# Get outputs
terraform output

# Save to file for reference
terraform output > terraform-outputs.txt
```

**Important Outputs:**
- `rds_endpoint` - Database connection string
- `redis_endpoint` - Redis connection string
- `s3_bucket` - S3 bucket name
- `cloudfront_url` - CDN URL

## Step 3: Configure Staging Environment Variables

### Backend Staging .env

Create `backend/.env.staging`:

```env
NODE_ENV=staging
PORT=3000
API_VERSION=v1

# Database (from Terraform output)
DATABASE_URL=postgresql://fastivalle_admin:PASSWORD@RDS_ENDPOINT:5432/fastivalle
DB_HOST=RDS_ENDPOINT
DB_PORT=5432
DB_USERNAME=fastivalle_admin
DB_PASSWORD=STRONG_PASSWORD_FROM_TERRAFORM
DB_DATABASE=fastivalle

# Redis (from Terraform output)
REDIS_URL=redis://REDIS_ENDPOINT:6379
REDIS_HOST=REDIS_ENDPOINT
REDIS_PORT=6379

# JWT (generate strong secrets)
JWT_SECRET=GENERATE_STRONG_SECRET_64_CHARS
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=GENERATE_DIFFERENT_STRONG_SECRET_64_CHARS
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=fastivalle-media-staging

# Stripe (use test keys for staging)
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Firebase
FIREBASE_PROJECT_ID=your-staging-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Email
SENDGRID_API_KEY=SG.your_sendgrid_key
EMAIL_FROM=noreply@fastivalle.com

# Sentry
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# CORS (update with staging domain)
CORS_ORIGIN=https://staging-api.fastivalle.com
```

### Mobile Staging .env

Create `mobile/.env.staging`:

```env
API_BASE_URL=https://staging-api.fastivalle.com
API_VERSION=v1
ENVIRONMENT=staging

SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-staging-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## Step 4: Database Setup on Staging

### Step 1: Run Migrations on Staging Database

```bash
cd backend

# Update data-source.ts with staging database URL
# Or use environment variable

# Set staging environment
export NODE_ENV=staging

# Run migrations
npm run migration:run
```

### Step 2: Verify Database

```bash
# Connect to staging database
psql -h RDS_ENDPOINT -U fastivalle_admin -d fastivalle

# List tables
\dt

# Exit
\q
```

## Step 5: Build and Push Docker Image

### Step 1: Build Docker Image

```bash
cd backend

# Build image
docker build -t fastivalle-backend:staging .

# Tag for ECR (if using ECR)
docker tag fastivalle-backend:staging YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fastivalle-backend:staging
```

### Step 2: Create ECR Repository (Optional)

```bash
# Create ECR repository
aws ecr create-repository --repository-name fastivalle-backend --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fastivalle-backend:staging
```

## Step 6: Deploy Backend to ECS

### Option A: Using ECS Fargate (Recommended)

#### Step 1: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name fastivalle-staging
```

#### Step 2: Create Task Definition

Create `infrastructure/ecs/task-definition.json`:

```json
{
  "family": "fastivalle-backend-staging",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "fastivalle-backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fastivalle-backend:staging",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "staging"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:fastivalle/db-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fastivalle-backend-staging",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Step 3: Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://infrastructure/ecs/task-definition.json
```

#### Step 4: Create Service

```bash
aws ecs create-service \
  --cluster fastivalle-staging \
  --service-name fastivalle-backend-staging \
  --task-definition fastivalle-backend-staging \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/xxx,containerName=fastivalle-backend,containerPort=3000"
```

### Option B: Using EC2 (Alternative)

1. Launch EC2 instance
2. Install Docker
3. Pull and run container
4. Set up reverse proxy (Nginx)
5. Configure security groups

## Step 7: Set Up Application Load Balancer

### Step 1: Create Target Group

```bash
aws elbv2 create-target-group \
  --name fastivalle-backend-staging \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --health-check-path /api/v1/health
```

### Step 2: Create Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name fastivalle-staging-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx
```

### Step 3: Create Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

## Step 8: Configure Domain and SSL

### Step 1: Get Load Balancer DNS

```bash
aws elbv2 describe-load-balancers --names fastivalle-staging-alb
```

### Step 2: Create Route 53 Record

```bash
# Create hosted zone (if not exists)
aws route53 create-hosted-zone --name staging-api.fastivalle.com --caller-reference $(date +%s)

# Create A record pointing to load balancer
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch file://route53-change.json
```

### Step 3: Set Up SSL Certificate

```bash
# Request certificate
aws acm request-certificate \
  --domain-name staging-api.fastivalle.com \
  --validation-method DNS

# Add HTTPS listener to load balancer
aws elbv2 create-listener \
  --load-balancer-arn arn:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:...
```

## Step 9: Set Up CI/CD Pipeline

### GitHub Actions Workflow

The workflow files are already created in `.github/workflows/`. Configure secrets:

1. Go to GitHub repository → Settings → Secrets
2. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `ECR_REPOSITORY`
   - `ECS_CLUSTER`
   - `ECS_SERVICE`

### Manual Deployment Script

Create `scripts/deploy-staging.sh`:

```bash
#!/bin/bash

set -e

echo "Building Docker image..."
docker build -t fastivalle-backend:staging ./backend

echo "Tagging image..."
docker tag fastivalle-backend:staging YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fastivalle-backend:staging

echo "Pushing to ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fastivalle-backend:staging

echo "Updating ECS service..."
aws ecs update-service \
  --cluster fastivalle-staging \
  --service fastivalle-backend-staging \
  --force-new-deployment

echo "Deployment initiated!"
```

## Step 10: Verify Deployment

### Test Backend API

```bash
# Health check
curl https://staging-api.fastivalle.com/api/v1/health

# Test endpoint
curl https://staging-api.fastivalle.com/api/v1/events
```

### Check Logs

```bash
# View ECS logs
aws logs tail /ecs/fastivalle-backend-staging --follow

# Or via CloudWatch Console
```

### Monitor Metrics

1. Go to CloudWatch → Metrics
2. Monitor:
   - CPU utilization
   - Memory utilization
   - Request count
   - Error rate

## Step 11: Mobile App Staging Build

### iOS Staging Build

```bash
cd mobile

# Update .env.staging
# Build for staging
npm run ios -- --configuration Release

# Or use Fastlane
cd ios
fastlane staging
```

### Android Staging Build

```bash
cd mobile

# Update .env.staging
# Build APK
cd android
./gradlew assembleStagingRelease

# Or build AAB
./gradlew bundleStagingRelease
```

## Step 12: Testing on Staging

1. **Install staging mobile app** on test devices
2. **Test all features** against staging API
3. **Monitor for errors** in Sentry
4. **Check performance** metrics
5. **Verify database** operations

## Step 13: Rollback Procedure

If deployment fails:

```bash
# Rollback ECS service to previous revision
aws ecs update-service \
  --cluster fastivalle-staging \
  --service fastivalle-backend-staging \
  --task-definition fastivalle-backend-staging:PREVIOUS_REVISION \
  --force-new-deployment

# Or revert Terraform changes
cd infrastructure/terraform
terraform destroy  # Only if necessary!
```

## Troubleshooting

### Issue: ECS Task Failing

```bash
# Check task logs
aws logs tail /ecs/fastivalle-backend-staging --follow

# Check task status
aws ecs describe-tasks --cluster fastivalle-staging --tasks TASK_ID
```

### Issue: Database Connection Failed

- Verify security group allows ECS to RDS
- Check database endpoint is correct
- Verify credentials in Secrets Manager

### Issue: High Costs

- Use smaller instance types for staging
- Set up auto-scaling with min=0
- Use spot instances if possible
- Monitor CloudWatch billing alerts

## Cost Optimization for Staging

1. **Use smaller instances**: t3.micro for RDS, cache.t3.micro for Redis
2. **Auto-scaling**: Scale down during off-hours
3. **Reserved instances**: Not needed for staging
4. **S3 lifecycle policies**: Delete old objects
5. **CloudWatch log retention**: Set to 7 days

## Next Steps

After staging deployment:
1. Complete thorough testing
2. Fix any issues found
3. Prepare for production deployment
4. Set up monitoring and alerts
