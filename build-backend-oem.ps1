# Build script for OEM backend image
param(
    [string]$Tag = "bisheng-backend-oem:latest"
)

Write-Host "[INFO] Building backend OEM image with tag: $Tag" -ForegroundColor Green

# Build the Docker image
docker build -f Dockerfile.backend.oem -t $Tag .

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Backend OEM image built successfully: $Tag" -ForegroundColor Green

    # Optional: Push to registry if needed
    # docker tag $Tag your-registry.com/$Tag
    # docker push your-registry.com/$Tag

    Write-Host "[INFO] To deploy on server, run:" -ForegroundColor Yellow
    Write-Host "1. Copy the image to server or push to registry"
    Write-Host "2. On server, update docker-compose.yml to use: image: $Tag"
    Write-Host "3. Run: docker-compose up -d backend"
} else {
    Write-Host "[FAIL] Failed to build backend OEM image" -ForegroundColor Red
    exit 1
}