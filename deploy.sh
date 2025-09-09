#!/bin/bash

# Store Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f .env.prod ]; then
    echo "📝 Creating production environment file..."
    cp env.prod.example .env.prod
    echo "⚠️  Please edit .env.prod with your actual configuration before running again."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser --noinput || true

# Collect static files
echo "📦 Collecting static files..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 Admin Panel: http://localhost:8000/admin"
