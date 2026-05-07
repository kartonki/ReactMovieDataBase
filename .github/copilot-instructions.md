# Copilot instructions

## Build and test commands

| Area | Command | Notes |
| --- | --- | --- |
| Frontend install | `npm install` or `npm ci` | Root app dependencies |
| Frontend dev server | `npm start` | CRA dev server |
| Frontend build | `npm run build` | Production build |
| Frontend test suite | `CI=true npm test -- --watchAll=false` | Jest via `react-scripts` |
| Single Jest file | `CI=true npm test -- --watchAll=false src/components/Home/Home.test.tsx` | Replace with any test file under `src/` |
| Single Jest test name | `CI=true npm test -- --watchAll=false --testNamePattern="Header is accessible"` | Useful for focused RTL/jest-axe work |
| Coverage | `npm run test:coverage` | Writes `coverage/` |
| Playwright prereq | `npm start` | Start this in a separate terminal first; `playwright.config.ts` has no `webServer` entry |
| Playwright suite | `npx playwright test` | Expects the app to already be available at `http://localhost:3000` |
| Single Playwright spec | `npx playwright test playwright/home.spec.ts --project=chromium` | Narrow to one browser while iterating |
| API install/build | `cd api && npm install && npm run build` | TypeScript Azure Functions |
| API local server | `cd api && func start` | Requires `TMDB_API_KEY` in `api/local.settings.json`; `prestart` runs the API build |

There is no dedicated lint script in either `package.json`; the root app only declares `eslintConfig: { "extends": "react-app" }`.

## High-level architecture

- The repository is split between a React 18 SPA in `src/` and an Azure Functions proxy in `api/`. The frontend never needs the TMDB key directly; all movie data should flow through the proxy functions.
- Routing is centralized in `src/components/App/App.tsx`: `/` renders `Home`, `/movie/:movieId` renders `Movie`, and a small wrapper adapts React Router v6 hooks back into the legacy `match.params` shape that `Movie` still expects.
- Frontend data access is centralized in `src/services/movieService.ts`. It targets `process.env.REACT_APP_API_URL` when set, otherwise the deployed Azure Functions URL. For local full-stack work, point `REACT_APP_API_URL` at the local Functions host or the frontend will silently keep talking to production. The service mirrors the four backend routes: popular movies, search, movie details, and credits.
- Each Azure Function in `api/*/index.ts` is a thin TMDB proxy with a matching `function.json` route:
  - `movies/popular`
  - `movies/search`
  - `movies/{id:int}`
  - `movies/{id:int}/credits`
- Caching is layered and spread across multiple places:
  - `src/index.tsx` registers the service worker.
  - `src/components/Home/Home.tsx` stores the landing-page state in `sessionStorage` under `HomeState`.
  - `src/components/Movie/Movie.tsx` caches per-movie payloads in `localStorage` keyed by movie ID.
  - `src/components/elements/ImageWebP/ImageWebp.tsx` caches WebP capability detection in `localStorage` under `webpSupport`.
  - `staticwebapp.config.json`, `.github/workflows/deploy.yml`, and `docs/CACHING_STRATEGY.md` all participate in the static asset caching story and should stay aligned.
- Deployment is driven by `.github/workflows/deploy.yml`: build the React app, deploy the Azure Functions app, then upload the frontend build to Azure Blob Storage with explicit cache headers.

## Key conventions

- Keep network access behind `src/services/movieService.ts`. Components should call the service instead of constructing API URLs or calling TMDB directly.
- Preserve the existing router compatibility pattern unless you are intentionally modernizing it: `Movie` is still a class component that receives a synthetic `match.params.movieId` prop from `MovieWrapper`. Routed tests should mirror the same `BrowserRouter` future flags used in `App.tsx`.
- Use `ImageWebp` for rendered images when touching movie, actor, hero, or logo imagery. Responsive TMDB image URLs are generated with helpers from `src/helpers.ts` (`generatePosterSrcSet`, `generateBackdropSrcSet`, `generateImageSrcSet`) rather than ad hoc string building.
- Component structure is consistent: reusable UI lives under `src/components/elements/*`, page-level containers live under `src/components/App`, `Home`, and `Movie`, and styling/tests are co-located next to the component.
- Tests use React Testing Library and `@testing-library/jest-dom`; accessibility checks use `jest-axe`. When a test renders routed UI, use `BrowserRouter` with the same future flags configured in `App.tsx`.
- Storage-backed UX is intentional. Clearing or renaming `HomeState`, the movie ID cache keys, or `webpSupport` changes user-visible behavior, so keep those keys stable unless a migration is part of the change. When UI changes seem not to apply, check service worker state plus those browser caches before assuming the code path is wrong.
- Search behavior is opinionated in `SearchBar`: minimum 3 characters, 1200 ms debounce, Enter triggers immediately, and an empty string resets the home page back to popular movies.
- Cache and hosting changes usually require updates in more than one place. If you change asset caching, service worker behavior, or the deployed API origin, check `staticwebapp.config.json`, `.github/workflows/deploy.yml`, `docs/CACHING_STRATEGY.md`, and the frontend config/service layer together.
