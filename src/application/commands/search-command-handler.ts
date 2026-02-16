import { ICommandHandler } from '../command-bus'
import { SearchCommand } from './search-command'
import { Result } from '@domain/result'
import { exaSearch } from '@infrastructure/exa-service'
import type { ExaSearchResponse } from '@domain/exa-types'

/**
 * Handler for SearchCommand
 * Calls the Exa API and returns the full search response
 */
export class SearchCommandHandler implements ICommandHandler<SearchCommand, ExaSearchResponse> {
  async handle(command: SearchCommand): Promise<Result<ExaSearchResponse>> {
    try {
      console.log(`Executing Exa ${command.mode} for: "${command.query}"`)

      const response = await exaSearch(command.query, command.mode)

      return Result.ok(response)
    } catch (error) {
      return Result.fail(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
