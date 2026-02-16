/**
 * Result wrapper for operation outcomes
 * Implements Railway Oriented Programming pattern
 */
export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string
  ) {}

  public get isSuccess(): boolean {
    return this._isSuccess
  }

  public get isFailure(): boolean {
    return !this._isSuccess
  }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result')
    }
    return this._value as T
  }

  public get error(): string {
    if (this._isSuccess) {
      throw new Error('Cannot get error from successful result')
    }
    return this._error as string
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value)
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, undefined, error)
  }
}
