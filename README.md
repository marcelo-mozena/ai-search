# AI Search - Electron App

A lightweight, fast Electron application built with TypeScript, React, and shadcn/ui, following CQRS (Command Query Responsibility Segregation) architecture and DRY (Don't Repeat Yourself) principles.

## 🚀 Features

- **Clean Architecture**: Organized into Domain, Application, Infrastructure, and Presentation layers
- **CQRS Pattern**: Separates read (queries) and write (commands) operations for better scalability
- **TypeScript**: Full type safety across the entire application
- **React 18**: Modern React with hooks and functional components
- **shadcn/ui**: Beautiful, accessible UI components built with Radix UI and Tailwind CSS
- **Electron**: Cross-platform desktop application for Windows and macOS
- **Vite**: Lightning-fast build tool and development server
- **VSCode Remote**: Full support for VSCode remote development

## 📁 Project Structure

```
ai-search/
├── electron/              # Electron main and preload processes
│   ├── main.ts           # Main process entry point
│   └── preload.ts        # Preload script with IPC handlers
├── src/
│   ├── domain/           # Domain layer - business entities
│   │   ├── command.ts    # Base command interfaces
│   │   ├── query.ts      # Base query interfaces
│   │   └── result.ts     # Result wrapper for operations
│   ├── application/      # Application layer - use cases
│   │   ├── command-bus.ts    # Command dispatcher
│   │   ├── query-bus.ts      # Query dispatcher
│   │   ├── commands/         # Command definitions and handlers
│   │   └── queries/          # Query definitions and handlers
│   ├── infrastructure/   # Infrastructure layer - external concerns
│   │   └── container.ts  # Dependency injection container
│   ├── presentation/     # Presentation layer - UI components
│   │   ├── components/   # Reusable UI components
│   │   └── pages/        # Page components
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main React component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── .vscode/              # VSCode configuration
│   ├── extensions.json   # Recommended extensions
│   ├── settings.json     # Editor settings
│   ├── launch.json       # Debug configurations
│   └── tasks.json        # Build tasks
└── package.json          # Project dependencies and scripts
```

## 🏗️ Architecture

### CQRS Pattern

The application implements CQRS to separate read and write operations:

- **Commands**: Represent write operations that change system state
- **Queries**: Represent read operations that don't modify state
- **Command Bus**: Routes commands to appropriate handlers
- **Query Bus**: Routes queries to appropriate handlers

### Clean Architecture Layers

1. **Domain Layer**: Core business logic and entities
2. **Application Layer**: Use cases, commands, queries, and their handlers
3. **Infrastructure Layer**: External dependencies and cross-cutting concerns
4. **Presentation Layer**: UI components and user interactions

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode (Vite dev server)
npm run dev

# Development mode with Electron
npm run electron:dev
```

### Building

```bash
# Build for production
npm run build

# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Type checking
npm run type-check
```

## 🎨 UI Components

The project uses shadcn/ui components with Tailwind CSS:

- **Button**: Customizable buttons with variants
- **Card**: Container components for content organization
- **Input**: Form input components

All components are fully typed and follow accessibility best practices.

## 🔌 VSCode Remote Development

This project is configured for VSCode remote development:

1. Install recommended extensions when prompted
2. Use the debug configurations in `.vscode/launch.json`
3. Run tasks from the Command Palette (Ctrl+Shift+P)

### Recommended Extensions

- Remote - SSH
- Remote - Containers
- Remote Explorer
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

## 📝 Adding New Features

### Creating a New Command

1. Define the command in `src/application/commands/`:

```typescript
import { BaseCommand } from '@domain/command'

export class MyCommand extends BaseCommand {
  constructor(public readonly data: string) {
    super()
  }
}
```

2. Create the handler:

```typescript
import { ICommandHandler } from '../command-bus'
import { MyCommand } from './my-command'
import { Result } from '@domain/result'

export class MyCommandHandler implements ICommandHandler<MyCommand> {
  async handle(command: MyCommand): Promise<Result<void>> {
    // Implementation
    return Result.ok()
  }
}
```

3. Register in the container (`src/infrastructure/container.ts`):

```typescript
this._commandBus.register('MyCommand', new MyCommandHandler())
```

### Creating a New Query

Follow the same pattern as commands but use `BaseQuery` and `IQueryHandler`.

## 🔒 Best Practices

- **DRY Principle**: Reuse code through abstraction
- **Single Responsibility**: Each class/module has one reason to change
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Type Safety**: Use TypeScript's type system to catch errors early
- **Immutability**: Prefer immutable data structures
- **Error Handling**: Use the Result pattern for predictable error handling

## 📦 Build Output

- **dist/**: Web application build output
- **dist-electron/**: Electron main process build output
- **release/**: Final packaged application for distribution

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain type safety
3. Add comments for complex logic
4. Test your changes
5. Follow the established patterns (CQRS, Clean Architecture)

## 📄 License

MIT