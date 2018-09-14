
type NotPromise<T> = Exclude<T, Promise<any>>

/**
 * A Monadic representation of a list of promises, exposing functions to
 * do computations over the promises.  The key feature of this monad is that
 * the computations are run in-sequence and not in parallel, like you would
 * get with Promise.all(arr.map(async () => {}))
 */
export default class SequentialAsyncList<T> {
  public static lift<T>(items: T[]) {
    return new SequentialAsyncList<T>(Promise.resolve(items))
  }

  private constructor(private promises: Promise<T[]>) { }

  /**
   * Transform each item in the sequential list using an async function
   *
   * The function is only invoked after the promise from the previous function completes.
   */
  // monad bind
  public flatMap<U>(fn: (item: T, index?: number) => Promise<U> | Array<Promise<U>>): SequentialAsyncList<U> {
    return new SequentialAsyncList<U>(
      this._bind(fn),
    )
  }

  /**
   * Transform each item in the sequential list using an async function
   *
   * The function is only invoked after the previous promise in sequence completes.
   */
  public map<U>(fn: (item: T, index?: number) => U & NotPromise<U>): SequentialAsyncList<U> {
    return this.flatMap((item, idx) => Promise.resolve(fn(item, idx)))
  }

  /**
   * Do something for each promise in sequence.  Returns a promise that can be awaited
   * to get the result.
   */
  public async forEach(fn: (item: T, index?: number) => Promise<any>): Promise<void> {
    const result = this.flatMap(fn)
    const arr = (await result.promises)
    return arr[arr.length - 1]
  }

  /**
   * Reduce each item in the sequence.
   */
  public async reduce<U>(fn: (aggregate: U, current: T, index?: number) => Promise<U>, initial?: U): Promise<U> {
    let aggregate = initial
    const result = this.flatMap((item, index) => (
      fn(aggregate, item, index).then((val) => aggregate = val)
    ))
    const arr = (await result.promises)
    return arr[arr.length - 1]
  }

  /**
   * Equivalent to Promise.all
   */
  public async all(): Promise<T[]> {
    // It's only the calculation methods that need to happen in sequence
    return Promise.all(await this.promises)
  }

  /**
   * Monadic Bind function
   *
   * Applies the transform function after all promises from prior transformations have finished.
   */
  private async _bind<U>(fn: (item: T, index?: number) => Promise<U> | Array<Promise<U>>): Promise<U[]> {
    const arr = (await this.promises)

    const result = [] as U[]
    for (let i = 0; i < arr.length; i++) {
      const xformed = fn(arr[i], i)
      // await all the resulting transformations before executing the next one
      if (Array.isArray(xformed)) {
        for (const v of xformed) {
          result.push(await v)
        }
      } else {
        result.push(await xformed)
      }
    }
    return result
  }
}
