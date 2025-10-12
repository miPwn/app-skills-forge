# Security Policy

## Supported Versions

We actively support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

Security vulnerabilities should not be reported through public GitHub issues.

### 2. Report privately

Send details to the maintainers via:
- GitHub Security Advisories (preferred)
- Direct email to repository maintainers

### 3. Include the following information

- Type of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 4. Response timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 7 days  
- **Status updates:** Every 7 days until resolved
- **Resolution:** Target 30 days for critical issues

## Security Measures

### Automated Security Scanning

Our CI/CD pipeline includes:
- **Dependency scanning** with `npm audit`
- **Container scanning** with Trivy
- **SAST scanning** for code vulnerabilities
- **Secret detection** to prevent credential leaks

### Development Security

- All secrets must use environment variables
- Dependencies are regularly updated
- Code is linted and reviewed before merge
- Admin authentication is required for sensitive operations

### Deployment Security

- Environment isolation
- Secure secret management
- HTTPS enforcement recommended
- Regular security updates applied

## Known Security Considerations

### Client-side Application
This is a frontend React application that processes user data locally. Key considerations:

- **Data Storage:** Uses browser localStorage
- **Authentication:** Simple password protection for admin features
- **External Dependencies:** Managed through npm with regular audits

### Recommendations for Production

1. **Environment Variables:** Always use strong admin passwords
2. **HTTPS:** Deploy with SSL/TLS encryption
3. **CSP Headers:** Configure Content Security Policy
4. **Regular Updates:** Keep dependencies current

## Contact

For security-related questions or concerns, please reach out through appropriate channels listed above.