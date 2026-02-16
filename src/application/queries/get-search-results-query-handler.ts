import { IQueryHandler } from '../query-bus'
import { GetSearchResultsQuery } from './get-search-results-query'
import { Result } from '@domain/result'

/**
 * Handler for GetSearchResultsQuery
 * Retrieves search results without modifying state
 */
export class GetSearchResultsQueryHandler implements IQueryHandler<GetSearchResultsQuery, any[]> {
  async handle(query: GetSearchResultsQuery): Promise<Result<any[]>> {
    try {
      console.log(`Fetching results for search: ${query.searchId}`)
      
      // Simulate fetching results
      const results = [
        { id: 1, title: 'Result 1', description: 'Sample result 1' },
        { id: 2, title: 'Result 2', description: 'Sample result 2' }
      ]
      
      return Result.ok(results)
    } catch (error) {
      return Result.fail(`Failed to fetch results: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
