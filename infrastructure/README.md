# Infrastructure as Code

This directory contains infrastructure configuration files for deploying the Fastivalle application to AWS.

## Terraform

Terraform files define the AWS infrastructure:
- VPC and networking
- RDS PostgreSQL database
- ElastiCache Redis
- S3 bucket for media storage
- CloudFront CDN distribution
- Security groups

### Usage

1. **Initialize Terraform**
   ```bash
   cd infrastructure/terraform
   terraform init
   ```

2. **Plan changes**
   ```bash
   terraform plan
   ```

3. **Apply changes**
   ```bash
   terraform apply
   ```

4. **Destroy infrastructure**
   ```bash
   terraform destroy
   ```

## Docker

Docker files for containerized deployment:
- `backend/Dockerfile` - Backend API container
- `docker-compose.prod.yml` - Production Docker Compose configuration

## CI/CD

GitHub Actions workflows:
- `backend-ci.yml` - Backend CI/CD pipeline
- `mobile-ci.yml` - Mobile CI/CD pipeline

## Deployment

### Staging Environment

1. Set up infrastructure with Terraform
2. Configure environment variables
3. Deploy backend API to ECS
4. Build and deploy mobile app

### Production Environment

1. Review and update Terraform variables
2. Apply infrastructure changes
3. Deploy backend with zero-downtime
4. Submit mobile app to app stores
