import { Config } from '../types/Config'
import { snakeCase } from 'snake-case'
export const pickAttributesToConfig = <T>(object: T, keys: Array<keyof T>) => {
  const result: Config = {}

  keys.forEach((key) => {
    const isEmptyObject =
      object[key] &&
      typeof object[key] === 'object' &&
      Object.keys(object[key]).length === 0

    if (object[key] && !isEmptyObject) {
      result[snakeCase(key as string)] = object[key] as unknown as Config
    }
  })

  return result
}
