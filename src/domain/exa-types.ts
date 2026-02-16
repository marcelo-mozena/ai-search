/**
 * Exa Search Result type
 */
export interface ExaSearchResult {
  id: string
  title: string
  url: string
  publishedDate?: string
  author?: string
  text?: string
  highlights?: string[]
  summary?: string
  score?: number
  image?: string
}

/**
 * Exa API response shape
 */
export interface ExaSearchResponse {
  requestId: string
  results: ExaSearchResult[]
  searchType?: string
  costDollars?: {
    total: number
  }
}

/**
 * Search mode: 'search' for quick results, 'research' for deep comprehensive results
 */
export type SearchMode = 'search' | 'research'

/**
 * Search request payload
 */
export interface ExaSearchRequest {
  query: string
  mode: SearchMode
}
