export class Result<T, E> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}
  // Static method to create a successful result
  static Ok<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>(value);
  }
  // Static method to create an error result
  static Err<E, T = never>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
  }
  // Check if result is Ok (success)
  isOk(): boolean {
    return this._error === undefined;
  }
  // Check if result is Err (failure)
  isErr(): boolean {
    return this._value === undefined;
  }
  // Get the success value (throws if there's an error)
  unwrap(): T {
    if (this.isErr()) {
      throw new Error("Tried to unwrap an Err value");
    }
    return this._value as T;
  }
  // Get the error value (throws if there's no error)
  unwrapErr(): E {
    if (this.isOk()) {
      throw new Error("Tried to unwrap an Ok value");
    }
    return this._error as E;
  }
  // Get the value or provide a default
  unwrapOr(defaultValue: T): T {
    return this.isOk() ? (this._value as T) : defaultValue;
  }
  // Get the error value without throwing, returns undefined if no error
  getErr(): E | undefined {
    return this.isErr() ? this._error : undefined;
  }
}
