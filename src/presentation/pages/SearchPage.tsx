import { useState } from 'react'
import { Container } from '@infrastructure/container'
import { SearchCommand } from '@application/commands/search-command'
import { Button } from '@/presentation/components/ui/button'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/presentation/components/ui/radio-group'
import { Label } from '@/presentation/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Badge } from '@/presentation/components/ui/badge'
import { Search, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react'
import type { SearchMode, ExaSearchResult, ExaSearchResponse } from '@domain/exa-types'

/**
 * Main Search Page Component
 * Provides Exa Search and Exa Research modes with a confirmation dialog for research.
 */
export function SearchPage() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<SearchMode>('search')
  const [results, setResults] = useState<ExaSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResearchWarning, setShowResearchWarning] = useState(false)
  const [searchInfo, setSearchInfo] = useState<{
    searchType?: string
    cost?: number
    count: number
  } | null>(null)

  const container = Container.getInstance()

  // ---------- helpers ----------

  const executeSearch = async (searchMode: SearchMode) => {
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)
    setResults([])
    setSearchInfo(null)

    try {
      const command = new SearchCommand(query, searchMode)
      const commandResult = await container.commandBus.execute<SearchCommand, ExaSearchResponse>(
        'SearchCommand',
        command
      )

      if (commandResult.isFailure) {
        setError(commandResult.error)
        return
      }

      const data = commandResult.value
      setResults(data.results)
      setSearchInfo({
        searchType: data.searchType,
        cost: data.costDollars?.total,
        count: data.results.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (mode === 'research') {
      // Show warning dialog before proceeding with research
      setShowResearchWarning(true)
    } else {
      executeSearch('search')
    }
  }

  const confirmResearch = () => {
    setShowResearchWarning(false)
    executeSearch('research')
  }

  // ---------- render ----------

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* ---- Header / Search Card ---- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            AI Search
          </CardTitle>
          <CardDescription>
            Search the web with Exa AI — choose between a quick search or a deep research mode.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Query Input */}
          <Textarea
            placeholder="Ask a question or describe what you're looking for…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            rows={3}
            className="resize-none"
          />

          {/* Mode Selection */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as SearchMode)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="search" id="mode-search" />
                <Label htmlFor="mode-search" className="cursor-pointer">
                  Exa Search
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="research" id="mode-research" />
                <Label htmlFor="mode-research" className="cursor-pointer">
                  Exa Research
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    Deep
                  </Badge>
                </Label>
              </div>
            </RadioGroup>

            <Button onClick={handleSubmit} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'research' ? 'Researching…' : 'Searching…'}
                </>
              ) : mode === 'research' ? (
                'Research'
              ) : (
                'Search'
              )}
            </Button>
          </div>

          {/* Error */}
          {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* ---- Search Metadata ---- */}
      {searchInfo && (
        <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            <strong>{searchInfo.count}</strong> result{searchInfo.count !== 1 && 's'}
          </span>
          {searchInfo.searchType && <Badge variant="outline">{searchInfo.searchType}</Badge>}
          {searchInfo.cost !== undefined && <span>Cost: ${searchInfo.cost.toFixed(4)}</span>}
        </div>
      )}

      {/* ---- Results ---- */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-start gap-2">
                  <span className="flex-1">{result.title}</span>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardTitle>
                <CardDescription className="truncate">{result.url}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.summary && <p className="text-sm">{result.summary}</p>}
                {!result.summary && result.text && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{result.text}</p>
                )}
                {result.highlights && result.highlights.length > 0 && (
                  <blockquote className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
                    {result.highlights[0]}
                  </blockquote>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  {result.author && <span>By {result.author}</span>}
                  {result.publishedDate && (
                    <span>· {new Date(result.publishedDate).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ---- Research Warning Dialog ---- */}
      <Dialog open={showResearchWarning} onOpenChange={setShowResearchWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Deep Research
            </DialogTitle>
            <DialogDescription>
              <strong>Exa Research</strong> performs a deep search that takes longer and costs more
              than a standard search. It will expand your query and return up to 20 comprehensive
              results with summaries and highlights.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowResearchWarning(false)}>
              Cancel
            </Button>
            <Button onClick={confirmResearch}>Yes, proceed with Research</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
