#!/bin/bash

# Vendorly Staging Deployment Script
# This script deploys the application to staging environment

set -e # Exit on any error

echo "🚀 Starting Vendorly Staging Deployment..."

# Configuration
STAGING_URL="https://staging.vendorly.in"
PROJECT_NAME="vendorly"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pre-deployment checks
log_info "Running pre-deployment checks..."

# Check if required tools are installed
command -v npm >/dev/null 2>&1 || { log_error "npm is required but not installed. Aborting."; exit 1; }
command -v git >/dev/null 2>&1 || { log_error "git is required but not installed. Aborting."; exit 1; }

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    log_warn "You're on branch '$CURRENT_BRANCH'. Make sure this is intentional."
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled."
        exit 0
    fi
fi

# Install dependencies
log_info "Installing dependencies..."
npm ci

# Run linting
log_info "Running code quality checks..."
npm run lint || {
    log_error "Linting failed. Please fix linting errors before deploying."
    exit 1
}

# Run type checking
log_info "Running TypeScript type checking..."
npm run type-check || {
    log_error "Type checking failed. Please fix TypeScript errors before deploying."
    exit 1
}

# Build application
log_info "Building application for staging..."
npm run build:staging || {
    log_error "Build failed. Please fix build errors before deploying."
    exit 1
}

# Test build
log_info "Testing production build..."
npm run preview &
PREVIEW_PID=$!
sleep 5

# Basic health check
if curl -f -s http://localhost:4173 > /dev/null; then
    log_info "Build test passed"
else
    log_error "Build test failed - application not responding"
    kill $PREVIEW_PID 2>/dev/null || true
    exit 1
fi

kill $PREVIEW_PID 2>/dev/null || true

# Deploy to Vercel (staging)
log_info "Deploying to staging environment..."

if command -v vercel >/dev/null 2>&1; then
    # Deploy to staging
    vercel --target staging --yes || {
        log_error "Staging deployment failed"
        exit 1
    }
else
    log_warn "Vercel CLI not found. Please install with: npm i -g vercel"
    log_info "You can deploy manually by pushing to the develop branch"
fi

# Wait for deployment to be ready
log_info "Waiting for staging deployment to be ready..."
sleep 30

# Health check on staging
log_info "Running health check on staging..."
HEALTH_CHECK_RETRIES=5
HEALTH_CHECK_DELAY=10

for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
    if curl -f -s "$STAGING_URL" > /dev/null; then
        log_info "Staging deployment is healthy!"
        break
    else
        if [ $i -eq $HEALTH_CHECK_RETRIES ]; then
            log_error "Health check failed after $HEALTH_CHECK_RETRIES attempts"
            exit 1
        else
            log_warn "Health check attempt $i failed, retrying in ${HEALTH_CHECK_DELAY}s..."
            sleep $HEALTH_CHECK_DELAY
        fi
    fi
done

# Run basic functionality tests
log_info "Running basic functionality tests..."

# Test main pages
PAGES=("/" "/login" "/register" "/home")
for page in "${PAGES[@]}"; do
    if curl -f -s "${STAGING_URL}${page}" > /dev/null; then
        log_info "✓ Page $page is accessible"
    else
        log_error "✗ Page $page is not accessible"
    fi
done

# Performance test (basic)
log_info "Running basic performance test..."
if command -v lighthouse >/dev/null 2>&1; then
    lighthouse "$STAGING_URL" \
        --only-categories=performance \
        --chrome-flags="--headless --no-sandbox" \
        --output=json \
        --output-path=./lighthouse-staging.json \
        --quiet || log_warn "Performance test failed"
    
    if [ -f "./lighthouse-staging.json" ]; then
        PERF_SCORE=$(cat lighthouse-staging.json | grep -o '"performance":[0-9.]*' | cut -d: -f2)
        if (( $(echo "$PERF_SCORE > 0.8" | bc -l) )); then
            log_info "✓ Performance score: $PERF_SCORE (Good)"
        else
            log_warn "⚠ Performance score: $PERF_SCORE (Needs improvement)"
        fi
    fi
else
    log_warn "Lighthouse not found, skipping performance test"
fi

# Security headers check
log_info "Checking security headers..."
SECURITY_HEADERS=("x-frame-options" "x-content-type-options" "strict-transport-security")
for header in "${SECURITY_HEADERS[@]}"; do
    if curl -s -I "$STAGING_URL" | grep -i "$header" > /dev/null; then
        log_info "✓ Security header $header is present"
    else
        log_warn "⚠ Security header $header is missing"
    fi
done

# Final deployment summary
log_info "📊 Staging Deployment Summary:"
echo "   🌐 URL: $STAGING_URL"
echo "   📅 Date: $(date)"
echo "   🌿 Branch: $CURRENT_BRANCH"
echo "   📝 Commit: $(git rev-parse --short HEAD)"

log_info "✅ Staging deployment completed successfully!"
log_info "🔗 Visit: $STAGING_URL"
log_info "📋 Test the application manually before promoting to production"

# Cleanup
rm -f lighthouse-staging.json

echo ""
log_info "Next steps:"
echo "   1. Manual testing on staging environment"
echo "   2. User acceptance testing"
echo "   3. Performance validation"
echo "   4. Security testing"
echo "   5. Promote to production when ready"