import { BaseCommand } from '@domain/command'
import type { SearchMode } from '@domain/exa-types'

/**
 * Command to perform an Exa search operation.
 * Contains the query text and the chosen search mode.
 */
export class SearchCommand extends BaseCommand {
  constructor(
    public readonly query: string,
    public readonly mode: SearchMode = 'search'
  ) {
    super()
  }
}
