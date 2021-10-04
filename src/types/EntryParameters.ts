// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntryParameters<T extends abstract new (...args: any) => any> =
  ConstructorParameters<T>
