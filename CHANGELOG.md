# Changelog

All notable changes to GuildForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-12

### Added
- Privacy-safe sample data with fictional adventurer names
- Environment variable configuration for admin password
- Comprehensive documentation (CONTRIBUTING, SECURITY, CODE_OF_CONDUCT)
- AGPL-3.0 license
- GitHub Actions workflow with security scanning
- Vulnerability scanning with npm audit and Trivy
- Enhanced .gitignore for better artifact exclusion

### Changed
- Admin authentication now uses environment variables instead of hardcoded password
- Improved README with security and deployment information
- Updated package version to 1.1.0

### Security
- Removed all real personal data from codebase
- Implemented proper secret management practices
- Added automated security scanning in CI/CD pipeline

### Fixed
- Re-enabled admin authentication (was temporarily disabled)

## [0.1.0] - Previous

### Added
- Initial RPG-themed skill matrix application
- React frontend with Vite build system
- Adventurer profiles and leaderboards
- Command center for admin functions
- Skill management and lore editing
- Profile image upload and cropping
- Responsive design for mobile and desktop