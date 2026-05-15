type ResultState<T, E> =
  | { readonly isSuccess: true; readonly value: T; readonly error?: never }
  | { readonly isSuccess: false; readonly error: E; readonly value?: never };

class Result<T, E = string> {
  private readonly state: ResultState<T, E>;

  private constructor(state: ResultState<T, E>) {
    this.state = state;
  }

  public get isSuccess(): boolean {
    return this.state.isSuccess;
  }

  static ok<T, E = string>(value: T): Result<T, E> {
    return new Result<T, E>({ isSuccess: true, value });
  }

  static fail<T, E = string>(error: E): Result<T, E> {
    return new Result<T, E>({ isSuccess: false, error });
  }

  getValueOrThrow(): T {
    if (this.state.isSuccess) {
      return this.state.value;
    }
    throw new Error("Cannot get value from failed Result");
  }

  getErrorOrThrow(): E {
    if (!this.state.isSuccess) {
      return this.state.error;
    }
    throw new Error("Cannot get error from successful Result");
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.state.isSuccess) {
      return Result.ok(fn(this.state.value));
    }

    return Result.fail<U, E>(this.state.error);
  }

  flatMap<U, F = E>(fn: (value: T) => Result<U, F>): Result<U, F | E> {
    if (this.state.isSuccess) {
      return fn(this.state.value);
    }
    return Result.fail<U, E>(this.state.error);
  }

  match<U>({
    success,
    error,
  }: {
    success: (v: T) => U;
    error: (e: E) => U;
  }): U {
    return this.state.isSuccess
      ? success(this.state.value)
      : error(this.state.error);
  }
}


export default Result;
