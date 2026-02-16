import { IQuery } from '@domain/query'
import { Result } from '@domain/result'

/**
 * Query Handler interface
 * All query handlers must implement this interface
 */
export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult> {
  handle(query: TQuery): Promise<Result<TResult>>
}

/**
 * Query Bus - dispatches queries to appropriate handlers
 * Follows Single Responsibility Principle
 */
export class QueryBus {
  private handlers = new Map<string, IQueryHandler<any, any>>()

  public register<TQuery extends IQuery<TResult>, TResult>(
    queryName: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryName, handler)
  }

  public async execute<TQuery extends IQuery<TResult>, TResult>(
    queryName: string,
    query: TQuery
  ): Promise<Result<TResult>> {
    const handler = this.handlers.get(queryName)
    if (!handler) {
      return Result.fail(`No handler registered for query: ${queryName}`)
    }

    try {
      return await handler.handle(query)
    } catch (error) {
      return Result.fail(
        `Error executing query: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
