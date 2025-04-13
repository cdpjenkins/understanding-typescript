# Mandelbrot Project Guidelines

This document outlines the coding standards, practices, and conventions to be followed when contributing to the Mandelbrot visualization project.

## Project Overview

This project contains two Mandelbrot set renderers:
- A TypeScript renderer that runs on the CPU with double-precision numbers
- A WebGL renderer that runs on the GPU for faster performance but with single-precision limitations

## Code Style and Conventions

### Naming Conventions
- **Classes**: Use PascalCase (e.g., `Vector2D`, `Matrix3D`, `MandelbrotParameters`)
- **Methods and Functions**: Use camelCase (e.g., `transformVector`, `resetParameters`, `parametersUpdated`)
- **Variables**: Use camelCase (e.g., `timeToRenderSpan`, `parameters`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_VALUE`)
- **Interfaces and Types**: Use PascalCase (e.g., `RenderResult`)
- **Enums**: Use PascalCase for enum names and UPPER_SNAKE_CASE for enum values (e.g., `RenderMode.WEB_GL`)

### TypeScript Usage
- Use strict type checking (enabled in tsconfig.json)
- Always provide explicit type annotations for function parameters
- Use TypeScript's constructor parameter property syntax for class properties
- Use interfaces to define contracts between components
- Leverage TypeScript's type system to catch errors at compile time
- Use enums for values with a fixed set of options

### Code Organization
- Organize code into modules with clear responsibilities
- Use a component-based architecture for UI elements
- Separate business logic from presentation logic
- Extract reusable functionality into utility classes or functions
- Use static factory methods for creating specific instances of objects

### Documentation
- Use JSDoc comments for classes, interfaces, and methods
- Document complex algorithms and mathematical operations
- Include parameter descriptions in JSDoc comments
- Document public APIs thoroughly

### Testing
- Write unit tests for all mathematical and business logic
- Use Jest for testing (as configured in the project)
- Aim for high test coverage, especially for critical components
- Test edge cases and error conditions
- Use test driven development: write a failing test, make it pass, refactor code if necessary

## Development Workflow

### Build Process
- Use `npm start` to start the development server
- Use `npm test` to run tests
- Use `npm run build` to create a production build

### Version Control
- Make atomic commits with clear, descriptive messages
- Commit directly to the master branch

### Code Quality
- Follow the "no unused locals" and "no unused parameters" rules
- Ensure no implicit any types
- Use strict null checks
- Avoid using `@ts-ignore` comments; fix the underlying issues instead
- Maintain consistent code formatting

## Accessibility and User Experience

- Ensure the UI is responsive and works on different screen sizes
- Implement keyboard shortcuts for common actions
- Provide clear feedback during long-running operations

## Future Development

Refer to the [tasks.md](../docs/tasks.md) file for a comprehensive list of planned improvements and features for the project.