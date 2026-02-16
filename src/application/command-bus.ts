import { ICommand } from '@domain/command'
import { Result } from '@domain/result'

/**
 * Command Handler interface
 * All command handlers must implement this interface
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  handle(command: TCommand): Promise<Result<TResult>>
}

/**
 * Command Bus - dispatches commands to appropriate handlers
 * Follows Single Responsibility Principle
 */
export class CommandBus {
  private handlers = new Map<string, ICommandHandler<any, any>>()

  public register<TCommand extends ICommand, TResult>(
    commandName: string,
    handler: ICommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandName, handler)
  }

  public async execute<TCommand extends ICommand, TResult>(
    commandName: string,
    command: TCommand
  ): Promise<Result<TResult>> {
    const handler = this.handlers.get(commandName)
    if (!handler) {
      return Result.fail(`No handler registered for command: ${commandName}`)
    }

    try {
      return await handler.handle(command)
    } catch (error) {
      return Result.fail(
        `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
