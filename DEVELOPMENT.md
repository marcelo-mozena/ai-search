# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- VSCode (recommended IDE)

### Initial Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-search
```

2. **Install dependencies**
```bash
npm install
```

3. **Install recommended VSCode extensions**
   - Open VSCode
   - Press Ctrl+Shift+P (Cmd+Shift+P on macOS)
   - Type "Extensions: Show Recommended Extensions"
   - Install all recommended extensions

## Development Workflow

### Running the Application

#### Web Development Mode (Faster iteration)
```bash
npm run dev
```
This starts the Vite development server at http://localhost:5173

#### Electron Development Mode
```bash
npm run electron:dev
```
This starts both Vite and Electron for full desktop app testing

### Code Quality

#### Type Checking
```bash
npm run type-check
```

#### Linting
```bash
npm run lint
```

#### Formatting (if Prettier is configured)
```bash
npx prettier --write .
```

## Building for Production

### Build All
```bash
npm run build
```
This creates:
- `dist/` - Web application bundle
- `dist-electron/` - Electron main process bundle
- `release/` - Packaged desktop applications

### Platform-Specific Builds

#### macOS
```bash
npm run build:mac
```
Output: `.dmg` and `.zip` in `release/` folder

#### Windows
```bash
npm run build:win
```
Output: `.exe` installer and portable version in `release/` folder

## Project Structure

### Source Code Organization

```
src/
├── domain/                 # Core business logic
│   ├── command.ts         # Command interfaces and base classes
│   ├── query.ts           # Query interfaces and base classes
│   └── result.ts          # Result wrapper for operations
│
├── application/           # Application logic and use cases
│   ├── command-bus.ts     # Command dispatcher
│   ├── query-bus.ts       # Query dispatcher
│   ├── commands/          # Command definitions and handlers
│   │   ├── search-command.ts
│   │   └── search-command-handler.ts
│   └── queries/           # Query definitions and handlers
│       ├── get-search-results-query.ts
│       └── get-search-results-query-handler.ts
│
├── infrastructure/        # External concerns
│   └── container.ts       # Dependency injection container
│
├── presentation/          # UI layer
│   ├── components/        # Reusable components
│   │   └── ui/           # shadcn/ui components
│   └── pages/            # Page components
│       └── SearchPage.tsx
│
└── types/                # TypeScript type definitions
    └── electron.d.ts     # Electron API types
```

## Adding New Features

### 1. Add a New Command (Write Operation)

**Step 1: Define the Command**
Create `src/application/commands/my-command.ts`:
```typescript
import { BaseCommand } from '@domain/command'

export class MyCommand extends BaseCommand {
  constructor(public readonly data: string) {
    super()
  }
}
```

**Step 2: Create the Handler**
Create `src/application/commands/my-command-handler.ts`:
```typescript
import { ICommandHandler } from '../command-bus'
import { MyCommand } from './my-command'
import { Result } from '@domain/result'

export class MyCommandHandler implements ICommandHandler<MyCommand, void> {
  async handle(command: MyCommand): Promise<Result<void>> {
    try {
      // Implement your business logic here
      console.log(`Processing: ${command.data}`)
      return Result.ok()
    } catch (error) {
      return Result.fail(`Error: ${error.message}`)
    }
  }
}
```

**Step 3: Register in Container**
Edit `src/infrastructure/container.ts`:
```typescript
import { MyCommandHandler } from '@application/commands/my-command-handler'

// In registerHandlers() method:
this._commandBus.register('MyCommand', new MyCommandHandler())
```

**Step 4: Use in Component**
```typescript
import { MyCommand } from '@application/commands/my-command'
import { Container } from '@infrastructure/container'

const container = Container.getInstance()
const command = new MyCommand('test data')
const result = await container.commandBus.execute('MyCommand', command)

if (result.isSuccess) {
  console.log('Success!')
} else {
  console.error(result.error)
}
```

### 2. Add a New Query (Read Operation)

Follow the same pattern as commands but use:
- `BaseQuery<TResult>`
- `IQueryHandler<TQuery, TResult>`
- Register with `queryBus`

### 3. Add a New UI Component

**Using shadcn/ui Pattern**
Create `src/presentation/components/ui/my-component.tsx`:
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "custom"
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", variant === "custom" && "custom-classes", className)}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

## VSCode Configuration

### Debugging

#### Debug React Application
1. Press F5
2. Select "Debug Renderer Process"
3. Browser opens with debugger attached

#### Debug Electron Main Process
1. Press F5
2. Select "Debug Main Process"
3. Electron app opens with debugger attached

#### Debug Both Simultaneously
1. Press F5
2. Select "Debug All"

### Tasks

Run tasks via Command Palette (Ctrl+Shift+P):
- `Tasks: Run Task`
- Select from available tasks (dev, build, type-check)

## Styling with Tailwind CSS

### Using Utility Classes
```tsx
<div className="flex items-center justify-between p-4 bg-background">
  <h1 className="text-2xl font-bold text-foreground">Title</h1>
</div>
```

### Using cn() Utility
```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)}>
  Content
</div>
```

### Theme Colors
Use CSS variables defined in `src/index.css`:
- `bg-background` / `text-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-destructive` / `text-destructive-foreground`
- `bg-muted` / `text-muted-foreground`
- `bg-accent` / `text-accent-foreground`

## Electron Integration

### IPC Communication

The preload script exposes safe APIs:

```typescript
// In React component
if (window.electron) {
  // Send command
  const result = await window.electron.sendCommand('channel', data)
  
  // Send query
  const data = await window.electron.sendQuery('channel', params)
  
  // Listen for events
  const unsubscribe = window.electron.on('event-update', (data) => {
    console.log('Event received:', data)
  })
  
  // Cleanup
  return () => unsubscribe()
}
```

### Adding IPC Handlers

Edit `electron/main.ts` to add IPC handlers:
```typescript
import { ipcMain } from 'electron'

ipcMain.handle('my-channel', async (event, data) => {
  // Handle request
  return { result: 'data' }
})
```

## Testing Strategy

### Manual Testing

1. Run development mode
2. Test feature manually
3. Check console for errors
4. Verify behavior in Electron and browser

### Future: Automated Testing

Plan to add:
- Unit tests for handlers
- Integration tests for CQRS flow
- E2E tests with Playwright/Spectron

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or change port in vite.config.ts
```

### TypeScript Errors
```bash
# Clear cache and rebuild
rm -rf dist dist-electron node_modules/.vite
npm run type-check
```

### Electron Not Starting
```bash
# Reinstall electron
npm install electron --force
```

### Build Fails
```bash
# Clean build directories
rm -rf dist dist-electron release
# Rebuild
npm run build
```

## Performance Optimization

### React Performance
1. Use `React.memo()` for expensive components
2. Use `useMemo()` and `useCallback()` for expensive calculations
3. Lazy load components with `React.lazy()`

### Electron Performance
1. Keep main process light
2. Use worker threads for heavy operations
3. Optimize IPC communication (batch requests)

### Bundle Size
1. Analyze bundle: `npx vite-bundle-visualizer`
2. Code split large dependencies
3. Use dynamic imports for routes

## Security Best Practices

1. **Never disable context isolation** in Electron
2. **Validate all user inputs** before processing
3. **Use TypeScript** for type safety
4. **Keep dependencies updated**: `npm audit fix`
5. **Sanitize IPC data** in preload script
6. **Don't expose sensitive APIs** to renderer

## Deployment

### GitHub Releases
1. Tag release: `git tag v1.0.0`
2. Push tag: `git push --tags`
3. Build will automatically publish to releases

### Manual Distribution
1. Run `npm run build:mac` or `npm run build:win`
2. Find installers in `release/` folder
3. Distribute via your preferred method

## Contributing Guidelines

1. Follow the existing code structure
2. Maintain type safety
3. Add comments for complex logic
4. Test changes thoroughly
5. Follow CQRS and Clean Architecture patterns
6. Keep commits atomic and well-described

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
