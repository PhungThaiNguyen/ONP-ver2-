# ================================================
# O.N.Precision - Build Script
# ================================================
# Run: .\build.ps1
# 
# This script:
# 1. Concatenates optimized JS files
# 2. Minifies using terser (if available)
# 3. Generates production bundle
# ================================================

$ErrorActionPreference = "Stop"

# Configuration
$jsDir = ".\assets\js"
$modulesDir = "$jsDir\modules"
$outputDir = ".\assets\js\dist"

# Files to bundle (in order)
$jsFiles = @(
    "$modulesDir\utils.optimized.js",
    "$modulesDir\form-validation.optimized.js",
    "$modulesDir\ui-components.optimized.js",
    "$jsDir\translations.js",
    "$jsDir\main.optimized.js"
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  O.N.Precision Build Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Create output directory
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Created output directory: $outputDir" -ForegroundColor Green
}

# Concatenate files
Write-Host "Concatenating JavaScript files..." -ForegroundColor Yellow

$bundleContent = @"
/**
 * O.N.Precision - Production Bundle
 * Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
 * 
 * This is a concatenated bundle of all optimized scripts.
 * For development, use individual files.
 */

"@

foreach ($file in $jsFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $bundleName = [System.IO.Path]::GetFileName($file)
        
        $bundleContent += @"

// ================================================
// File: $bundleName
// ================================================
$content

"@
        Write-Host "  + $bundleName" -ForegroundColor Gray
    } else {
        Write-Host "  ! Missing: $file" -ForegroundColor Red
    }
}

# Write bundle
$bundlePath = "$outputDir\bundle.js"
$bundleContent | Set-Content $bundlePath -Encoding UTF8
Write-Host ""
Write-Host "Bundle created: $bundlePath" -ForegroundColor Green

# Get file sizes
$originalSize = 0
foreach ($file in $jsFiles) {
    if (Test-Path $file) {
        $originalSize += (Get-Item $file).Length
    }
}

$bundleSize = (Get-Item $bundlePath).Length

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Build Summary" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Original files size: $([math]::Round($originalSize / 1KB, 2)) KB"
Write-Host "  Bundle size:         $([math]::Round($bundleSize / 1KB, 2)) KB"
Write-Host ""

# Try to minify with terser if available
$terserPath = Get-Command terser -ErrorAction SilentlyContinue
if ($terserPath) {
    Write-Host "Minifying with Terser..." -ForegroundColor Yellow
    
    $minPath = "$outputDir\bundle.min.js"
    & terser $bundlePath -o $minPath --compress --mangle
    
    $minSize = (Get-Item $minPath).Length
    Write-Host "  Minified size:       $([math]::Round($minSize / 1KB, 2)) KB" -ForegroundColor Green
    Write-Host "  Compression ratio:   $([math]::Round((1 - $minSize / $bundleSize) * 100, 1))%" -ForegroundColor Green
} else {
    Write-Host "Note: Install terser for minification: npm install -g terser" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""

# Usage instructions
Write-Host "To use in HTML:" -ForegroundColor Yellow
Write-Host '  <script src="./assets/js/dist/bundle.min.js"></script>' -ForegroundColor White
Write-Host ""
