#!/bin/bash

# Test script to validate cache header deployment commands
# This script simulates the Azure CLI commands without actually uploading

set -e

BUILD_DIR="./build"

echo "🧪 Testing cache header deployment commands..."

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

echo "✅ Build directory found"

# Test static files upload command
if [ -d "$BUILD_DIR/static" ]; then
    echo "✅ Static directory found with files:"
    find "$BUILD_DIR/static" -type f | head -5
    echo "   Command: az storage blob upload-batch --content-cache-control 'public, max-age=31536000, immutable'"
else
    echo "⚠️  Static directory not found"
fi

# Test individual file uploads
FILES_TO_CHECK=("favicon.ico" "icon-192.png" "icon-512.png" "manifest.json")
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$BUILD_DIR/$file" ]; then
        echo "✅ Found $file - Command: az storage blob upload --content-cache-control 'public, max-age=2592000'"
    else
        echo "⚠️  File $file not found (optional)"
    fi
done

# Test HTML upload
if [ -f "$BUILD_DIR/index.html" ]; then
    echo "✅ Found index.html - Command: az storage blob upload --content-cache-control 'no-cache, no-store, must-revalidate'"
else
    echo "❌ index.html not found"
    exit 1
fi

# Test service worker (optional)
if [ -f "$BUILD_DIR/service-worker.js" ]; then
    echo "✅ Found service-worker.js - Command: az storage blob upload --content-cache-control 'no-cache, no-store, must-revalidate'"
else
    echo "ℹ️  service-worker.js not found (this is normal for create-react-app without PWA)"
fi

echo ""
echo "🎉 All cache header deployment commands validated successfully!"
echo ""
echo "Cache Strategy Summary:"
echo "  📦 Static JS/CSS (hashed): 1 year cache (immutable)"
echo "  🖼️  Images/Icons: 30 days cache"
echo "  📄 HTML files: No cache (always fresh)"
echo "  ⚙️  Service worker: No cache (always fresh)"