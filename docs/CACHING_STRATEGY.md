# Caching Strategy for React Movie Database

This document outlines the HTTP caching strategy implemented for the React Movie Database application to optimize performance and reduce bandwidth usage.

## Overview

The application implements a multi-layered caching strategy that balances performance with the need for timely updates:

1. **Azure Storage + CDN Level**: Cache headers set during deployment
2. **Application Level**: Static Web App configuration for redundancy
3. **Client Level**: Service Worker and localStorage for API data

## HTTP Cache Headers Configuration

### 1. Long-term Cache (1 year) - Immutable Assets

**Assets**: JavaScript and CSS files with content hashes
- **Files**: `/static/js/*.js`, `/static/css/*.css`
- **Cache-Control**: `public, max-age=31536000, immutable`
- **Rationale**: These files have content-based hashes in their filenames. When content changes, the filename changes, so they can be cached indefinitely.

Example files:
- `main.85e57b9d.js`
- `main.a7e95f16.css`

### 2. Medium-term Cache (30 days) - Static Assets

**Assets**: Images, icons, and manifest files
- **Files**: `*.png`, `*.ico`, `/manifest.json`, `/images/*`
- **Cache-Control**: `public, max-age=2592000`
- **Rationale**: These files change infrequently but don't have content hashes, so a moderate cache time balances performance and freshness.

### 3. No Cache - Dynamic Content

**Assets**: HTML files and service workers
- **Files**: `/index.html`, `/service-worker.js`, `/* (fallback)`
- **Cache-Control**: `no-cache, no-store, must-revalidate`
- **Rationale**: These files must always be fresh to ensure users get the latest application version and routing works correctly.

## Implementation Details

### Azure CLI Deployment

The GitHub Actions workflow (`deploy.yml`) sets cache headers during the upload process:

```bash
# Long cache for hashed static assets
az storage blob upload-batch \
  --content-cache-control "public, max-age=31536000, immutable" \
  -s ./build/static

# Medium cache for images and icons
az storage blob upload \
  --content-cache-control "public, max-age=2592000" \
  --file "./build/favicon.ico"

# No cache for HTML
az storage blob upload \
  --content-cache-control "no-cache, no-store, must-revalidate" \
  --file "./build/index.html"
```

### Static Web App Configuration

The `staticwebapp.config.json` provides route-based cache headers as a backup:

```json
{
  "routes": [
    {
      "route": "/static/js/*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

## Client-Side Caching

### Service Worker
- Uses Workbox for runtime caching
- Implements cache-first strategy for static assets
- Network-first strategy for API calls

### localStorage Caching
The application also implements client-side caching for:
- **Movie Data**: `localStorage.setItem(movieId, movieData)`
- **WebP Support Detection**: `localStorage.setItem('webpSupport', boolean)`

## Cache Validation

### Testing Cache Headers

You can verify cache headers are working by:

1. **Browser DevTools**:
   ```
   Network tab → Reload page → Check Response Headers
   ```

2. **curl command**:
   ```bash
   curl -I https://www.KartonReactMovie.net/static/js/main.85e57b9d.js
   curl -I https://www.KartonReactMovie.net/index.html
   ```

3. **Expected Headers**:
   - JS/CSS files should show: `Cache-Control: public, max-age=31536000, immutable`
   - index.html should show: `Cache-Control: no-cache, no-store, must-revalidate`

### Performance Benefits

This caching strategy provides:
- **Reduced Bandwidth**: Static assets cached for up to 1 year
- **Faster Load Times**: Repeat visitors load from cache
- **Always Fresh Content**: HTML and routing always current
- **Optimal CDN Usage**: Long-lived assets minimize origin requests

## Troubleshooting

### Cache Not Working
1. Check Azure Storage cache settings
2. Verify CDN cache rules
3. Test with browser cache disabled
4. Check deployment logs for upload errors

### Users Not Getting Updates
1. Verify index.html has no-cache headers
2. Check service worker registration
3. Ensure JavaScript/CSS files have new hashes after build

## Maintenance

- Monitor CDN cache hit rates
- Review cache settings quarterly
- Update documentation when cache strategy changes
- Test cache behavior after deployment changes