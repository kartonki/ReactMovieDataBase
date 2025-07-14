# Build Status
[![Deploy React Movie App to Azure Static Storage](https://github.com/kartonki/ReactMovieDataBase/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/kartonki/ReactMovieDataBase/actions/workflows/deploy.yml)

# ReactMovieDataBase
Simple client side application featuring React and components, just for fun 

It requires an API Key from https://www.themoviedb.org, I suggest you go there now and get yourself a key for it  :)

In addition it uses the free credits form Azure DevOps to trigger builds from a CI environment configured based on pushes to Main branch, it does also trigger releases based on successful builds using the same pipelines for Release and it deploys this app as a static website in Azure Storage

## Performance & Caching

This application implements an optimized caching strategy for static assets to improve performance and reduce bandwidth usage. See [docs/CACHING_STRATEGY.md](docs/CACHING_STRATEGY.md) for detailed information about:

- HTTP cache headers configuration
- Azure Storage + CDN caching setup
- Client-side caching with localStorage and Service Worker
- Cache validation and troubleshooting

## Test Coverage

To run tests with coverage reporting:

```bash
npm run test:coverage
```

This will generate a `coverage/` directory with a summary and HTML report.




