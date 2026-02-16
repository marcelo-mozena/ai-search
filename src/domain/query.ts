/**
 * Base interface for all queries in the CQRS pattern
 * Queries represent read operations that don't change system state
 */
export interface IQuery<TResult = any> {
  readonly timestamp: Date
  readonly queryId: string
}

/**
 * Base query class with common properties
 */
export abstract class BaseQuery<TResult = any> implements IQuery<TResult> {
  public readonly timestamp: Date
  public readonly queryId: string

  constructor() {
    this.timestamp = new Date()
    this.queryId = crypto.randomUUID()
  }
}
