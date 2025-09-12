# Contributing to Flamingo AI Chat Platform

Thank you for your interest in contributing to Flamingo! This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Issues

1. **Check existing issues** before creating a new one
2. **Use descriptive titles** and provide detailed descriptions
3. **Include steps to reproduce** any bugs
4. **Provide environment details** (OS, Node version, browser)

### Development Workflow

1. **Fork** the repository
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with clear, logical commits
4. **Test your changes** thoroughly
5. **Submit a pull request**

### Development Setup

1. Clone your fork
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Make your changes
6. Test in both light and dark themes
7. Ensure responsive design works

### Code Style Guidelines

#### General Principles
- **Write clean, readable code**
- **Use TypeScript** for type safety
- **Follow existing patterns** in the codebase
- **Keep functions small** and focused
- **Use meaningful names** for variables and functions

#### Frontend Guidelines
- Use **functional components** with hooks
- Follow **React best practices**
- Use **TanStack Query** for data fetching
- Implement **proper error boundaries**
- Ensure **accessibility** (a11y) compliance

#### Backend Guidelines
- Use **Express.js** patterns consistently
- Implement **proper error handling**
- **Validate input data** using Zod schemas
- Use **Drizzle ORM** for database operations
- Follow **RESTful API** conventions

#### Styling Guidelines
- Use **Tailwind CSS** utility classes
- Follow **Shadcn/UI** component patterns
- Ensure **responsive design**
- Support both **light and dark themes**
- Test across different screen sizes

### Database Changes

1. **Never modify** existing database schemas without discussion
2. **Use Drizzle ORM** for all database operations
3. **Run `npm run db:push`** to sync schema changes
4. **Test migrations** thoroughly before submitting

### Testing

1. **Test all functionality** in development
2. **Check responsive design** on multiple screen sizes
3. **Verify dark/light theme** compatibility
4. **Test authentication flows**
5. **Ensure chat functionality** works properly

### Pull Request Guidelines

#### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] Features work in both themes
- [ ] Responsive design verified
- [ ] No console errors or warnings
- [ ] Database migrations work properly

#### PR Description Should Include
- **Clear description** of changes made
- **Reasoning** behind the approach
- **Testing steps** for reviewers
- **Screenshots** for UI changes
- **Breaking changes** (if any)

### Code Review Process

1. **Be respectful** and constructive
2. **Focus on code quality** and maintainability
3. **Consider performance** implications
4. **Check security** aspects
5. **Verify accessibility** standards

### Getting Help

- **Check documentation** first
- **Search existing issues** for similar problems
- **Join community discussions**
- **Ask questions** in pull request comments

### Development Environment

#### Required Tools
- Node.js 18+
- PostgreSQL
- Git
- Code editor (VS Code recommended)

#### Recommended Extensions
- TypeScript support
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### Community Guidelines

- **Be welcoming** to newcomers
- **Help others** learn and improve
- **Share knowledge** and best practices
- **Respect different perspectives**
- **Focus on constructive feedback**

## Recognition

Contributors who make significant improvements will be recognized in:
- Project documentation
- Release notes
- Community showcases

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Start a discussion in the community forum
- Contact the maintainers

---

**Dev World** - *Development and contribution guidelines maintained by the development community*

Thank you for contributing to Flamingo AI Chat Platform!