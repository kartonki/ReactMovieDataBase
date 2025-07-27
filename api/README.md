# Movie Database API Proxy

This directory contains Azure Functions that serve as a proxy between the React frontend and the TMDB (The Movie Database) API. This approach keeps the TMDB API key secure on the server side instead of exposing it in the client-side bundle.

## Functions

### 1. Popular Movies (`/api/movies/popular`)
- **Method**: GET
- **Parameters**: 
  - `page` (optional): Page number, defaults to 1
  - `language` (optional): Language code, defaults to "en-US"
- **Proxies**: `https://api.themoviedb.org/3/movie/popular`

### 2. Search Movies (`/api/movies/search`)
- **Method**: GET
- **Parameters**:
  - `query` (required): Search term
  - `page` (optional): Page number, defaults to 1
  - `language` (optional): Language code, defaults to "en-US"
- **Proxies**: `https://api.themoviedb.org/3/search/movie`

### 3. Movie Details (`/api/movies/{id}`)
- **Method**: GET
- **Parameters**:
  - `id` (required): Movie ID from URL path
  - `language` (optional): Language code, defaults to "en-US"
- **Proxies**: `https://api.themoviedb.org/3/movie/{id}`

### 4. Movie Credits (`/api/movies/{id}/credits`)
- **Method**: GET
- **Parameters**:
  - `id` (required): Movie ID from URL path
- **Proxies**: `https://api.themoviedb.org/3/movie/{id}/credits`

## Environment Variables

The Azure Functions require the following environment variable to be set:
- `TMDB_API_KEY`: Your TMDB API key (set as Application Setting in Azure)

## Deployment

These functions are automatically deployed as part of the GitHub Actions workflow. The deployment:
1. Creates or updates the Azure Function App
2. Sets the TMDB API key as an application setting
3. Deploys the function code

## Local Development

To run locally:
1. Install Azure Functions Core Tools
2. Set `TMDB_API_KEY` in `local.settings.json`
3. Run `func start` from the api directory

## Security Features

- CORS enabled for frontend domain
- API key stored securely on server
- No sensitive data exposed to client
- All requests proxied through Azure Functions