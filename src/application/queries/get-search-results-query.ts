import { BaseQuery } from '@domain/query'

/**
 * Query to get search results
 * Read-only operation that doesn't modify state
 */
export class GetSearchResultsQuery extends BaseQuery<any[]> {
  constructor(public readonly searchId: string) {
    super()
  }
}
