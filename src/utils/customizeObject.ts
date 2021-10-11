export type Customizer<T> = (obj: T) => void

export const customizeObject = <T>(obj: T, customizer?: Customizer<T>) => {
  customizer && customizer(obj)

  return obj
}
