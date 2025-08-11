# Automated Code Review Setup

This repository is configured with automated code review that triggers when code is pushed to the `main` branch or when pull requests are opened targeting `main`.

## What Gets Reviewed

The automated code review system runs the following checks:

### 🎨 Code Quality

- **ESLint**: Analyzes code for potential errors, bugs, and style issues
- **Prettier**: Validates code formatting consistency
- **TypeScript**: Performs static type checking

### 🧪 Testing

- **Unit Tests**: Runs all Vitest unit tests
- **E2E Tests**: Executes Playwright end-to-end tests
- **Build Verification**: Ensures the application builds successfully for production

## Workflow Triggers

The automated review runs on:

- Direct pushes to `main` branch
- Pull requests targeting `main` branch

## Review Results

After each run, you'll see:

- ✅ **Success**: All checks passed - code is ready for deployment
- ❌ **Failure**: Some checks failed - review required before merging

## Local Development

Before pushing to main, ensure your code passes all checks locally:

```bash
# Check formatting
npm run format:check

# Run linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test
npm run test:e2e

# Build verification
npm run build
```

## Fixing Issues

If the automated review fails:

1. **Formatting Issues**: Run `npm run format` to auto-fix
2. **Linting Issues**: Check ESLint output and fix manually or use auto-fix where possible
3. **Type Errors**: Review TypeScript errors and fix type issues
4. **Test Failures**: Debug and fix failing tests
5. **Build Errors**: Review build output and fix configuration/code issues

The goal is to maintain high code quality and catch issues before they reach production.
