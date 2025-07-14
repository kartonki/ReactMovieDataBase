# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the repository maintainers. We will respond within 24 hours to acknowledge the report and within 5 business days with our findings and any necessary fixes.

## Security Measures

This project implements the following security measures:

### Dependencies
- Regular dependency auditing with `npm audit`
- Package overrides to fix security vulnerabilities
- Automated security checks in CI/CD pipeline

**Note**: There are 3 moderate vulnerabilities in webpack-dev-server that only affect the development environment and do not impact production builds. These are limited by react-scripts dependencies and will be resolved when react-scripts is updated.

### Web Application Security
- Content Security Policy (CSP) headers
- X-Frame-Options to prevent clickjacking
- X-Content-Type-Options to prevent MIME-type confusion
- X-XSS-Protection for older browsers
- Strict Referrer Policy

### CI/CD Security
- Updated GitHub Actions using latest secure versions
- Proper permission scoping
- Environment variable protection for secrets
- Secure Azure authentication using OIDC

### Code Security
- No use of dangerous functions like `eval()` or `dangerouslySetInnerHTML`
- API keys managed through environment variables
- Input validation and sanitization
- React Router future flags for compatibility and security