# CQRS Pattern Examples

This document provides practical examples of implementing the CQRS pattern in the AI Search application.

## Table of Contents

1. [Basic Command Example](#basic-command-example)
2. [Basic Query Example](#basic-query-example)
3. [Complex Command with Validation](#complex-command-with-validation)
4. [Query with Parameters](#query-with-parameters)
5. [Error Handling](#error-handling)
6. [Using in React Components](#using-in-react-components)
7. [Async Operations](#async-operations)
8. [Testing Commands and Queries](#testing-commands-and-queries)

## Basic Command Example

### 1. Create a Command

```typescript
// src/application/commands/create-search-command.ts
import { BaseCommand } from '@domain/command'

export class CreateSearchCommand extends BaseCommand {
  constructor(
    public readonly query: string,
    public readonly filters?: SearchFilters
  ) {
    super()
  }
}

interface SearchFilters {
  category?: string
  dateFrom?: Date
  dateTo?: Date
}
```

### 2. Create the Handler

```typescript
// src/application/commands/create-search-command-handler.ts
import { ICommandHandler } from '../command-bus'
import { CreateSearchCommand } from './create-search-command'
import { Result } from '@domain/result'

export class CreateSearchCommandHandler 
  implements ICommandHandler<CreateSearchCommand, { searchId: string }> {
  
  async handle(command: CreateSearchCommand): Promise<Result<{ searchId: string }>> {
    try {
      // Validate input
      if (!command.query || command.query.trim().length === 0) {
        return Result.fail('Query cannot be empty')
      }

      if (command.query.length > 500) {
        return Result.fail('Query too long (max 500 characters)')
      }

      // Business logic here
      const searchId = crypto.randomUUID()
      
      // In a real app, you might save to database here
      console.log(`Created search: ${searchId} for query: "${command.query}"`)

      return Result.ok({ searchId })
    } catch (error) {
      return Result.fail(
        `Failed to create search: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
```

### 3. Register the Handler

```typescript
// src/infrastructure/container.ts
import { CreateSearchCommandHandler } from '@application/commands/create-search-command-handler'

// In registerHandlers():
this._commandBus.register('CreateSearchCommand', new CreateSearchCommandHandler())
```

### 4. Execute the Command

```typescript
// In your React component or service
import { Container } from '@infrastructure/container'
import { CreateSearchCommand } from '@application/commands/create-search-command'

const container = Container.getInstance()

const command = new CreateSearchCommand('AI and machine learning', {
  category: 'technology',
  dateFrom: new Date('2024-01-01')
})

const result = await container.commandBus.execute<CreateSearchCommand, { searchId: string }>(
  'CreateSearchCommand',
  command
)

if (result.isSuccess) {
  console.log(`Search created with ID: ${result.value.searchId}`)
} else {
  console.error(`Error: ${result.error}`)
}
```

## Basic Query Example

### 1. Create a Query

```typescript
// src/application/queries/get-search-history-query.ts
import { BaseQuery } from '@domain/query'

export interface SearchHistoryItem {
  id: string
  query: string
  timestamp: Date
  resultsCount: number
}

export class GetSearchHistoryQuery extends BaseQuery<SearchHistoryItem[]> {
  constructor(
    public readonly userId: string,
    public readonly limit: number = 10
  ) {
    super()
  }
}
```

### 2. Create the Handler

```typescript
// src/application/queries/get-search-history-query-handler.ts
import { IQueryHandler } from '../query-bus'
import { GetSearchHistoryQuery, SearchHistoryItem } from './get-search-history-query'
import { Result } from '@domain/result'

export class GetSearchHistoryQueryHandler 
  implements IQueryHandler<GetSearchHistoryQuery, SearchHistoryItem[]> {
  
  async handle(query: GetSearchHistoryQuery): Promise<Result<SearchHistoryItem[]>> {
    try {
      // Validate
      if (!query.userId) {
        return Result.fail('User ID is required')
      }

      if (query.limit < 1 || query.limit > 100) {
        return Result.fail('Limit must be between 1 and 100')
      }

      // Fetch data (mock data for example)
      const history: SearchHistoryItem[] = [
        {
          id: '1',
          query: 'React patterns',
          timestamp: new Date(),
          resultsCount: 42
        },
        {
          id: '2',
          query: 'TypeScript best practices',
          timestamp: new Date(),
          resultsCount: 35
        }
      ]

      return Result.ok(history.slice(0, query.limit))
    } catch (error) {
      return Result.fail(
        `Failed to get search history: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
```

## Complex Command with Validation

```typescript
// src/application/commands/update-search-settings-command.ts
import { BaseCommand } from '@domain/command'

export interface SearchSettings {
  maxResults: number
  sortBy: 'relevance' | 'date' | 'popularity'
  includeArchived: boolean
  language: string
}

export class UpdateSearchSettingsCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly settings: SearchSettings
  ) {
    super()
  }

  // Command-level validation
  validate(): string | null {
    if (!this.userId) {
      return 'User ID is required'
    }

    if (this.settings.maxResults < 1 || this.settings.maxResults > 1000) {
      return 'Max results must be between 1 and 1000'
    }

    const validSortOptions = ['relevance', 'date', 'popularity']
    if (!validSortOptions.includes(this.settings.sortBy)) {
      return 'Invalid sort option'
    }

    return null
  }
}

// Handler
export class UpdateSearchSettingsCommandHandler 
  implements ICommandHandler<UpdateSearchSettingsCommand, void> {
  
  async handle(command: UpdateSearchSettingsCommand): Promise<Result<void>> {
    // Validate command
    const validationError = command.validate()
    if (validationError) {
      return Result.fail(validationError)
    }

    try {
      // Business logic
      console.log(`Updating settings for user ${command.userId}`)
      // Save to database...

      return Result.ok()
    } catch (error) {
      return Result.fail(
        `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
```

## Query with Parameters

```typescript
// src/application/queries/search-query.ts
import { BaseQuery } from '@domain/query'

export interface SearchFilters {
  category?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  minScore?: number
}

export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  score: number
  timestamp: Date
}

export class SearchQuery extends BaseQuery<SearchResult[]> {
  constructor(
    public readonly query: string,
    public readonly filters: SearchFilters = {},
    public readonly page: number = 1,
    public readonly pageSize: number = 20
  ) {
    super()
  }
}

// Handler with filtering
export class SearchQueryHandler implements IQueryHandler<SearchQuery, SearchResult[]> {
  async handle(query: SearchQuery): Promise<Result<SearchResult[]>> {
    try {
      // Build query based on filters
      let results: SearchResult[] = await this.fetchFromDatabase(query.query)

      // Apply filters
      if (query.filters.category) {
        results = results.filter(r => r.category === query.filters.category)
      }

      if (query.filters.tags && query.filters.tags.length > 0) {
        results = results.filter(r => 
          query.filters.tags!.some(tag => r.tags.includes(tag))
        )
      }

      if (query.filters.dateFrom) {
        results = results.filter(r => r.timestamp >= query.filters.dateFrom!)
      }

      if (query.filters.dateTo) {
        results = results.filter(r => r.timestamp <= query.filters.dateTo!)
      }

      if (query.filters.minScore) {
        results = results.filter(r => r.score >= query.filters.minScore!)
      }

      // Apply pagination
      const start = (query.page - 1) * query.pageSize
      const paginatedResults = results.slice(start, start + query.pageSize)

      return Result.ok(paginatedResults)
    } catch (error) {
      return Result.fail(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private async fetchFromDatabase(query: string): Promise<SearchResult[]> {
    // Mock implementation
    return []
  }
}
```

## Error Handling

### Custom Error Types

```typescript
// src/domain/errors.ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(action: string) {
    super(`Unauthorized to perform action: ${action}`)
    this.name = 'UnauthorizedError'
  }
}
```

### Using in Handlers

```typescript
export class DeleteSearchCommandHandler 
  implements ICommandHandler<DeleteSearchCommand, void> {
  
  async handle(command: DeleteSearchCommand): Promise<Result<void>> {
    try {
      // Check if search exists
      const search = await this.findSearch(command.searchId)
      if (!search) {
        return Result.fail(`Search with id ${command.searchId} not found`)
      }

      // Check authorization
      if (search.userId !== command.userId) {
        return Result.fail('Unauthorized to delete this search')
      }

      // Delete
      await this.deleteSearch(command.searchId)
      return Result.ok()

    } catch (error) {
      if (error instanceof ValidationError) {
        return Result.fail(`Validation error: ${error.message}`)
      }
      if (error instanceof NotFoundError) {
        return Result.fail(error.message)
      }
      if (error instanceof UnauthorizedError) {
        return Result.fail(error.message)
      }
      return Result.fail(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }
}
```

## Using in React Components

### With Hooks

```typescript
// src/presentation/hooks/use-search.ts
import { useState, useCallback } from 'react'
import { Container } from '@infrastructure/container'
import { SearchQuery } from '@application/queries/search-query'

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const container = Container.getInstance()

  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    setLoading(true)
    setError(null)

    try {
      const searchQuery = new SearchQuery(query, filters)
      const result = await container.queryBus.execute<SearchQuery, SearchResult[]>(
        'SearchQuery',
        searchQuery
      )

      if (result.isSuccess) {
        setResults(result.value)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [container])

  return { results, loading, error, search }
}

// Usage in component
function SearchComponent() {
  const { results, loading, error, search } = useSearch()
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    search(query, { category: 'technology' })
  }

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <div className="error">{error}</div>}
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  )
}
```

## Async Operations

### Command with Callback

```typescript
export class ProcessLargeDataCommand extends BaseCommand {
  constructor(
    public readonly dataId: string,
    public readonly onProgress?: (percent: number) => void
  ) {
    super()
  }
}

export class ProcessLargeDataCommandHandler 
  implements ICommandHandler<ProcessLargeDataCommand, { resultId: string }> {
  
  async handle(command: ProcessLargeDataCommand): Promise<Result<{ resultId: string }>> {
    try {
      const totalSteps = 100
      
      for (let i = 0; i <= totalSteps; i++) {
        // Process data...
        await this.processChunk(i)
        
        // Report progress
        if (command.onProgress) {
          command.onProgress((i / totalSteps) * 100)
        }
      }

      return Result.ok({ resultId: crypto.randomUUID() })
    } catch (error) {
      return Result.fail(`Processing failed: ${error.message}`)
    }
  }

  private async processChunk(index: number): Promise<void> {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 10))
  }
}
```

## Testing Commands and Queries

### Unit Test for Command Handler

```typescript
// tests/application/commands/create-search-command-handler.test.ts
import { CreateSearchCommand } from '@application/commands/create-search-command'
import { CreateSearchCommandHandler } from '@application/commands/create-search-command-handler'

describe('CreateSearchCommandHandler', () => {
  let handler: CreateSearchCommandHandler

  beforeEach(() => {
    handler = new CreateSearchCommandHandler()
  })

  it('should create search successfully', async () => {
    const command = new CreateSearchCommand('test query')
    const result = await handler.handle(command)

    expect(result.isSuccess).toBe(true)
    expect(result.value.searchId).toBeDefined()
  })

  it('should fail with empty query', async () => {
    const command = new CreateSearchCommand('')
    const result = await handler.handle(command)

    expect(result.isFailure).toBe(true)
    expect(result.error).toContain('cannot be empty')
  })

  it('should fail with query too long', async () => {
    const longQuery = 'a'.repeat(501)
    const command = new CreateSearchCommand(longQuery)
    const result = await handler.handle(command)

    expect(result.isFailure).toBe(true)
    expect(result.error).toContain('too long')
  })
})
```

### Integration Test

```typescript
// tests/integration/cqrs-flow.test.ts
import { Container } from '@infrastructure/container'
import { CreateSearchCommand } from '@application/commands/create-search-command'
import { GetSearchQuery } from '@application/queries/get-search-query'

describe('CQRS Flow', () => {
  let container: Container

  beforeAll(() => {
    container = Container.getInstance()
  })

  it('should execute command and query in sequence', async () => {
    // Create a search
    const createCommand = new CreateSearchCommand('integration test')
    const createResult = await container.commandBus.execute(
      'CreateSearchCommand',
      createCommand
    )

    expect(createResult.isSuccess).toBe(true)
    const searchId = createResult.value.searchId

    // Query the search
    const getQuery = new GetSearchQuery(searchId)
    const queryResult = await container.queryBus.execute(
      'GetSearchQuery',
      getQuery
    )

    expect(queryResult.isSuccess).toBe(true)
    expect(queryResult.value.id).toBe(searchId)
  })
})
```

## Best Practices

1. **Keep Commands Small**: One command should do one thing
2. **Validate Early**: Validate in command constructor or handler
3. **Use Result Pattern**: Always return Result<T> for predictable error handling
4. **No Side Effects in Queries**: Queries should only read data
5. **Idempotent Commands**: Commands should be safely retryable
6. **Log Important Operations**: Add logging for debugging
7. **Document Complex Logic**: Add comments for non-obvious code
8. **Test Handlers**: Write unit tests for all handlers

## Additional Resources

- [CQRS Pattern by Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Domain-Driven Design](https://domainlanguage.com/ddd/)
