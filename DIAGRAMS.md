# Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Electron Desktop App                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐              ┌──────────────────┐          │
│  │  Main Process   │◄────IPC─────►│ Renderer Process │          │
│  │  (Node.js)      │              │  (React + Vite)  │          │
│  └─────────────────┘              └──────────────────┘          │
│         │                                   │                    │
│         │                                   │                    │
│    ┌────▼────┐                    ┌────────▼────────┐          │
│    │ Window  │                    │   React App     │          │
│    │Manager  │                    │  (Clean Arch)   │          │
│    └─────────┘                    └─────────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

```
┌──────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                            │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  React Components, Pages, Hooks                         │      │
│  │  - SearchPage.tsx                                       │      │
│  │  - UI Components (Button, Card, Input)                 │      │
│  └────────────────────────────────────────────────────────┘      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ uses
┌───────────────────────────▼──────────────────────────────────────┐
│                    Application Layer                              │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Commands & Queries (CQRS)                             │      │
│  │  ┌─────────────────┐      ┌─────────────────┐         │      │
│  │  │  Command Bus    │      │   Query Bus     │         │      │
│  │  │  - Dispatcher   │      │   - Dispatcher  │         │      │
│  │  └────────┬────────┘      └────────┬────────┘         │      │
│  │           │                        │                  │      │
│  │  ┌────────▼────────┐      ┌───────▼────────┐         │      │
│  │  │   Handlers      │      │    Handlers    │         │      │
│  │  │  - SearchCmd    │      │  - GetResults  │         │      │
│  │  └─────────────────┘      └────────────────┘         │      │
│  └────────────────────────────────────────────────────────┘      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼──────────────────────────────────────┐
│                      Domain Layer                                 │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Core Business Logic                                   │      │
│  │  - BaseCommand                                         │      │
│  │  - BaseQuery                                           │      │
│  │  - Result<T> (Railway Pattern)                        │      │
│  │  - Interfaces (ICommand, IQuery)                      │      │
│  └────────────────────────────────────────────────────────┘      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ used by
┌───────────────────────────▼──────────────────────────────────────┐
│                   Infrastructure Layer                            │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Cross-Cutting Concerns                                │      │
│  │  - Container (DI)                                      │      │
│  │  - Service Registrations                              │      │
│  │  - External Dependencies                              │      │
│  └────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

## CQRS Flow

### Command Flow (Write Operation)

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐      ┌──────────┐
│  User   │─────►│  Component  │─────►│ Command Bus  │─────►│ Handler  │
│ Action  │      │  (React)    │      │              │      │          │
└─────────┘      └─────────────┘      └──────────────┘      └─────┬────┘
                                                                    │
                                                                    │
                                                          ┌─────────▼──────┐
                                                          │  Business      │
                                                          │  Logic         │
                                                          └─────────┬──────┘
                                                                    │
                                                          ┌─────────▼──────┐
                                                          │  Result<T>     │
                                                          │  (Success/Fail)│
                                                          └────────────────┘
```

### Query Flow (Read Operation)

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐      ┌──────────┐
│  User   │─────►│  Component  │─────►│  Query Bus   │─────►│ Handler  │
│ Request │      │  (React)    │      │              │      │          │
└─────────┘      └─────────────┘      └──────────────┘      └─────┬────┘
                                                                    │
                                                                    │
                                                          ┌─────────▼──────┐
                                                          │  Fetch Data    │
                                                          │  (Read-Only)   │
                                                          └─────────┬──────┘
                                                                    │
                                                          ┌─────────▼──────┐
                                                          │  Result<T>     │
                                                          │  (Data/Error)  │
                                                          └────────────────┘
```

## Component Hierarchy

```
App.tsx
  └── SearchPage.tsx
        ├── Card (shadcn/ui)
        │     ├── CardHeader
        │     │     ├── CardTitle
        │     │     └── CardDescription
        │     └── CardContent
        │           ├── Input (shadcn/ui)
        │           └── Button (shadcn/ui)
        └── Card (Results)
              ├── CardHeader
              │     ├── CardTitle
              │     └── CardDescription
              └── [Repeated for each result]
```

## Data Flow in Application

```
┌──────────────────────────────────────────────────────────────────┐
│                        User Interaction                           │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                ┌───────────▼───────────┐
                │  SearchPage Component │
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │   Container.getInstance()
                └───────────┬───────────┘
                            │
        ┌───────────────────┴────────────────────┐
        │                                        │
┌───────▼───────┐                     ┌─────────▼────────┐
│ CommandBus     │                     │   QueryBus      │
│ .execute()     │                     │   .execute()    │
└───────┬────────┘                     └─────────┬───────┘
        │                                        │
┌───────▼───────┐                     ┌─────────▼───────┐
│ CommandHandler │                     │  QueryHandler   │
└───────┬────────┘                     └─────────┬───────┘
        │                                        │
        └────────────┬──────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   Result<T> Pattern   │
         │   (Success or Fail)   │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Update UI State     │
         └───────────────────────┘
```

## Dependency Injection Flow

```
┌─────────────────────────────────────────────┐
│           Container (Singleton)              │
├─────────────────────────────────────────────┤
│                                              │
│  registerHandlers() {                        │
│    ┌──────────────────────────────────┐    │
│    │  Command Handlers Registration   │    │
│    │  - SearchCommandHandler          │    │
│    │  - ...                           │    │
│    └──────────────────────────────────┘    │
│                                              │
│    ┌──────────────────────────────────┐    │
│    │   Query Handlers Registration    │    │
│    │  - GetSearchResultsHandler       │    │
│    │  - ...                           │    │
│    └──────────────────────────────────┘    │
│  }                                           │
│                                              │
│  get commandBus() { return this._bus }      │
│  get queryBus() { return this._bus }        │
│                                              │
└─────────────────────────────────────────────┘
```

## File Structure Map

```
src/
├── domain/                    # Business Logic (No Dependencies)
│   ├── command.ts            # ICommand, BaseCommand
│   ├── query.ts              # IQuery<T>, BaseQuery<T>
│   └── result.ts             # Result<T> (Success/Fail)
│
├── application/              # Use Cases (Depends on Domain)
│   ├── command-bus.ts        # Routes commands to handlers
│   ├── query-bus.ts          # Routes queries to handlers
│   ├── commands/
│   │   ├── search-command.ts
│   │   └── search-command-handler.ts
│   └── queries/
│       ├── get-search-results-query.ts
│       └── get-search-results-query-handler.ts
│
├── infrastructure/           # External Concerns
│   └── container.ts          # DI Container, registers all handlers
│
└── presentation/             # UI Layer (Depends on All)
    ├── components/
    │   └── ui/               # shadcn/ui components
    │       ├── button.tsx
    │       ├── card.tsx
    │       └── input.tsx
    └── pages/
        └── SearchPage.tsx    # Uses Container to execute commands/queries
```

## Electron IPC Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Renderer Process                        │
│  ┌─────────────────────────────────────────────────┐     │
│  │           React Application                      │     │
│  │  ┌─────────────────────────────────────┐        │     │
│  │  │  window.electron API                │        │     │
│  │  │  - sendCommand(channel, data)       │        │     │
│  │  │  - sendQuery(channel, data)         │        │     │
│  │  │  - on(channel, callback)            │        │     │
│  │  └─────────────────────────────────────┘        │     │
│  └────────────────────┬──────────────────────────────    │
│                       │ contextBridge                     │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────┼───────────────────────────────────┐
│  Preload Script       │                                   │
│  ┌────────────────────▼──────────────────────┐           │
│  │  Validates channels (whitelist)           │           │
│  │  Only exposes safe IPC methods             │           │
│  └────────────────────┬───────────────────────┘           │
│                       │ ipcRenderer                       │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                    Main Process                            │
│  ┌──────────────────────────────────────────────┐        │
│  │  ipcMain.handle('channel', handler)          │        │
│  │  - Window management                         │        │
│  │  - File system access                        │        │
│  │  - OS integration                            │        │
│  └──────────────────────────────────────────────┘        │
└───────────────────────────────────────────────────────────┘
```

## Build Process

```
┌─────────────┐
│ Source Code │
└──────┬──────┘
       │
       ├─────────► TypeScript Compiler ────► Type Checking
       │
       ├─────────► Vite ─────────────────► dist/ (Web Bundle)
       │                                    - index.html
       │                                    - assets/
       │
       ├─────────► Vite (Electron) ───────► dist-electron/
       │                                    - main.js
       │                                    - preload.js
       │
       └─────────► electron-builder ──────► release/
                                            - Windows (.exe)
                                            - macOS (.dmg)
                                            - Linux (.AppImage)
```

## Development Workflow

```
┌──────────────┐
│ Code Change  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Vite HMR     │ ◄──── Fast (~10ms)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Browser Hot  │
│ Reload       │
└──────────────┘

Alternative:

┌──────────────┐
│ Code Change  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Save File    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ESLint Check │ ◄──── On Save
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Prettier     │ ◄──── Format
│ Format       │
└──────────────┘
```

## Legend

```
┌────────┐
│  Box   │  = Component/Layer/Process
└────────┘

────►      = Data/Control Flow

◄────►     = Bi-directional Communication

   │
   ├───    = Hierarchy/Dependency
   │
```

## Quick Reference

### Adding a New Feature

```
1. Domain Layer
   └── Define interfaces if needed

2. Application Layer
   ├── Create Command/Query
   ├── Create Handler
   └── Register in Container

3. Presentation Layer
   └── Use in React Component

Result: Feature implemented with clean separation!
```

### Error Handling Pattern

```
Try                Success
 ├─► Execute  ───► Result.ok(value)
 │
 └─► Catch    ───► Result.fail(error)
```
