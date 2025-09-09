# Store Deployment Script for Windows PowerShell
# Usage: .\deploy.ps1 [production|staging]

param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting deployment for $Environment environment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Create production environment file if it doesn't exist
if (-not (Test-Path ".env.prod")) {
    Write-Host "📝 Creating production environment file..." -ForegroundColor Yellow
    Copy-Item "env.prod.example" ".env.prod"
    Write-Host "⚠️  Please edit .env.prod with your actual configuration before running again." -ForegroundColor Yellow
    exit 1
}

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create superuser (optional)
Write-Host "👤 Creating superuser..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser --noinput 2>$null

# Collect static files
Write-Host "📦 Collecting static files..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📊 Admin Panel: http://localhost:8000/admin" -ForegroundColor Cyan
