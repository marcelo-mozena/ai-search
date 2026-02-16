/**
 * Base interface for all commands in the CQRS pattern
 * Commands represent write operations that change system state
 */
export interface ICommand {
  readonly timestamp: Date
  readonly commandId: string
}

/**
 * Base command class with common properties
 */
export abstract class BaseCommand implements ICommand {
  public readonly timestamp: Date
  public readonly commandId: string

  constructor() {
    this.timestamp = new Date()
    this.commandId = crypto.randomUUID()
  }
}
