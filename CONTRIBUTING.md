# Contributing to GuildForge

Thank you for your interest in contributing to GuildForge! This guide will help you get started.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/app-skills-forge.git
   cd app-skills-forge
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use ESLint configuration provided
- Follow existing naming conventions
- Write meaningful commit messages

### Testing
- Add tests for new features
- Ensure all tests pass before submitting PR
- Run `npm run lint` to check code style

### Security
- Never commit secrets or API keys
- Use environment variables for configuration
- Run `npm audit` to check for vulnerabilities

## Submitting Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "Add descriptive commit message"
   ```

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request**

### Pull Request Guidelines
- Provide clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure CI checks pass

## Issue Reporting

When reporting issues:
- Use the issue templates provided
- Include steps to reproduce
- Provide system information
- Add relevant logs or screenshots

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.