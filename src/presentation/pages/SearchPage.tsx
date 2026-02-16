import { useState } from 'react'
import { Container } from '@infrastructure/container'
import { SearchCommand } from '@application/commands/search-command'
import { GetSearchResultsQuery } from '@application/queries/get-search-results-query'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Search } from 'lucide-react'

/**
 * Main Search Page Component
 * Demonstrates CQRS pattern usage in the presentation layer
 */
export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const container = Container.getInstance()

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Execute command (write operation)
      const command = new SearchCommand(query)
      const commandResult = await container.commandBus.execute('SearchCommand', command)

      if (commandResult.isFailure) {
        setError(commandResult.error)
        return
      }

      // Execute query (read operation)
      const searchQuery = new GetSearchResultsQuery(commandResult.value.id)
      const queryResult = await container.queryBus.execute('GetSearchResultsQuery', searchQuery)

      if (queryResult.isFailure) {
        setError(queryResult.error)
        return
      }

      setResults(queryResult.value)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            AI Search
          </CardTitle>
          <CardDescription>
            A lightweight Electron app with CQRS architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          {error && (
            <p className="text-destructive mt-2 text-sm">{error}</p>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {results.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle className="text-lg">{result.title}</CardTitle>
                <CardDescription>{result.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
