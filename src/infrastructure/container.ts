import { CommandBus } from '@application/command-bus'
import { QueryBus } from '@application/query-bus'
import { SearchCommandHandler } from '@application/commands/search-command-handler'
import { GetSearchResultsQueryHandler } from '@application/queries/get-search-results-query-handler'

/**
 * Dependency Injection Container
 * Central place for managing application dependencies
 * Follows Dependency Inversion Principle
 */
export class Container {
  private static instance: Container
  private _commandBus: CommandBus
  private _queryBus: QueryBus

  private constructor() {
    this._commandBus = new CommandBus()
    this._queryBus = new QueryBus()
    this.registerHandlers()
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  private registerHandlers(): void {
    // Register command handlers
    this._commandBus.register('SearchCommand', new SearchCommandHandler())

    // Register query handlers
    this._queryBus.register('GetSearchResultsQuery', new GetSearchResultsQueryHandler())
  }

  public get commandBus(): CommandBus {
    return this._commandBus
  }

  public get queryBus(): QueryBus {
    return this._queryBus
  }
}
