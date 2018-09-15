
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(), ms),
  )
}

export type AsyncMap<T extends { [key: string]: any }> = {
  [k in keyof T]: Promise<T[k]>
}
