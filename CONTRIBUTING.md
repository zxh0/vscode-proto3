# Contributing to vscode-proto3

Thank you for your interest in contributing to vscode-proto3!

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/zxh0/vscode-proto3.git
   cd vscode-proto3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

## Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run build`         | Compile TypeScript to JavaScript         |
| `npm run compile`       | Watch mode compilation                   |
| `npm test`              | Run unit tests                           |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run lint`          | Lint TypeScript files                    |
| `npm run lint:fix`      | Lint and auto-fix TypeScript files       |
| `npm run lint:md`       | Lint Markdown files                      |
| `npm run lint:md:fix`   | Lint and auto-fix Markdown files         |
| `npm run format`        | Format TypeScript files with Prettier    |
| `npm run format:check`  | Check formatting without modifying files |

## Running the Extension Locally

1. Open the repository in VS Code
2. Press `F5` to launch a new VS Code window with the extension loaded
3. Open a `.proto` file to test the extension features

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Code Style

- TypeScript strict mode is enabled
- ESLint enforces code quality rules
- Prettier handles code formatting
- Markdownlint enforces markdown style

Run `npm run verify` before committing to lint, markdown-lint, format-check, and run tests without extra tooling.

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Ensure all tests pass (`npm test`)
5. Ensure linting passes (`npm run lint && npm run lint:md`)
6. Commit your changes with a descriptive message
7. Push to your fork and submit a pull request

## Reporting Issues

Please use the [GitHub issue tracker](https://github.com/zxh0/vscode-proto3/issues)
to report bugs or request features.

When reporting bugs, please include:

- VS Code version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Any relevant `.proto` file content

## License

By contributing, you agree that your contributions will be licensed under the
same license as the project (see LICENSE.txt).
