import { BaseCommand } from '@domain/command'

/**
 * Command to perform a search operation
 * Follows Command pattern - encapsulates all information needed for the action
 */
export class SearchCommand extends BaseCommand {
  constructor(public readonly query: string) {
    super()
  }
}
