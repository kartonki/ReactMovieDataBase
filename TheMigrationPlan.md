## Plan: Decouple React App and Azure Function API

Rewrite into two independently deployable apps: a modern Vite-based React frontend and a standalone Azure Function App API. Keep the current route/response contracts stable first, then harden security and observability before cutover. This lowers migration risk while improving performance, maintainability, and security posture.

**Steps**
1. Phase 1 - Target architecture and contract freeze.
Define the new system boundary as two separate deployables (frontend app + API function app) while preserving current endpoints (`/movies/popular`, `/movies/search`, `/movies/{id}`, `/movies/{id}/credits`) and response shape for zero-regression migration. Document API base URL strategy (env-based) and environment matrix (local/dev/stage/prod).
2. Phase 1 - Repository strategy and CI split.
Choose one of two structures: separate repos (recommended for strongest decoupling) or monorepo with independent pipelines. Create independent build/test/deploy workflows so frontend deploys do not redeploy API and API deploys do not rebuild frontend.
3. Phase 2 - Frontend modernization to Vite.
Migrate CRA to Vite in the new frontend app, preserving existing React 18 and router structure. Replace all `process.env.REACT_APP_*` usage with Vite env access (`import.meta.env.VITE_*`). Move entry HTML to Vite format, update service-worker registration assumptions, and keep current component/API service abstraction intact.
4. Phase 2 - Frontend caching and hosting modernization.
Replace CRA `build/static` assumptions with Vite `dist/assets` cache rules. Rework static hosting/CDN config to preserve immutable caching for hashed assets and no-cache for HTML/service worker. Keep SPA fallback behavior.
5. Phase 2 - Frontend test migration.
Replace react-scripts test runner with Vitest + Testing Library while keeping Playwright E2E. Ensure test parity for existing component and integration tests before feature changes.
6. Phase 3 - API extraction and internal structure hardening.
Create a standalone Azure Function App project with shared modules for TMDB client, validation, response/error mapping, and CORS/security headers. Keep v1 routes backward-compatible and add centralized request validation for query/path params.
7. Phase 3 - API security baseline (required before production cutover).
Implement explicit CORS allowlist by environment (no wildcard origins), bounded input validation, standardized sanitized error responses, App Insights structured logging, and rate limiting/throttling (prefer at API gateway). Move TMDB secret handling to Key Vault via managed identity where feasible; otherwise enforce secret rotation and least-privilege app settings.
8. Phase 3 - API edge security and exposure model.
Recommended: place API behind Azure API Management (or Front Door + WAF + APIM) for centralized CORS, throttling, header enforcement, and abuse control. Keep Function App endpoints non-public where possible (private endpoint or access restrictions). If direct public Function App is retained initially, enforce strict CORS + rate limits + monitoring alerts.
9. Phase 4 - Deployment pipelines and release policy.
Create separate OIDC-based GitHub Actions workflows: frontend deploy workflow and API deploy workflow. Add environment approvals for prod, dependency audit/SCA, and secret-scanning checks. Use staged rollout: deploy API first (backward compatible), then frontend switch to new API URL.
10. Phase 4 - Cutover and rollback plan.
Execute staged validation in dev/stage/prod. Keep old app/API available during cutover window. Enable fast rollback by maintaining previous frontend artifact and previous Function App slot/version.
11. Phase 5 - Post-cutover hardening.
Add dashboards/alerts (5xx, latency, throttling events, origin rejections), periodic dependency upgrades, key rotation runbook, and security regression checks.

**Parallelization and dependencies**
1. Steps 1-2 are blocking design decisions.
2. Steps 3-5 (frontend track) can run in parallel with steps 6-8 (backend/security track) after step 1 is complete.
3. Step 9 depends on outputs from steps 3-8.
4. Step 10 depends on step 9.
5. Step 11 starts after successful step 10.

**Verification**
1. Frontend quality gates: lint/typecheck/unit tests (Vitest), Playwright smoke suite, bundle size comparison, and no runtime env var errors.
2. API quality gates: unit/integration tests for all 4 routes, validation rejection tests (bad id/page/query), and upstream TMDB error-handling tests.
3. Security checks: CORS allowlist enforcement tests, CSP/header verification, secret source verification (Key Vault/app settings), dependency audit, and basic abuse/rate-limit tests.
4. Deployment checks: independent frontend/API deployment success, stage-to-prod promotion workflow, and rollback drill.
5. Runtime checks: App Insights dashboards show healthy error/latency baselines and alerting is active.

**Decisions**
- Included scope: architectural decoupling, Vite modernization, independent Azure Function API, CI/CD split, and production security baseline.
- Excluded scope: feature redesign, UI redesign, and major API contract changes in initial migration.
- Recommendation: preserve v1 API contract first, then iterate on optional v2 improvements after stable decoupled launch.
- Recommendation: for strongest security posture, use APIM in front of Function App rather than exposing wildcard public endpoints.
