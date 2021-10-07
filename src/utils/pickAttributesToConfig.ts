import { Config } from '../types/Config'
import { snakeCase } from 'snake-case'
import { ChildEntryConfigContext } from '../models/Entity'
import { compileExpression, ExpressionOrValue } from '../models/variables'
import { KeyMap } from '../types/KeyMap'
export const pickAttributesToConfig = <T>(
  object: T,
  keys: Array<keyof T>,
  context: ChildEntryConfigContext<unknown>,
) => {
  const result: Config = {}

  keys.forEach((key) => {
    const isEmptyObject =
      object[key] &&
      typeof object[key] === 'object' &&
      Object.keys(object[key]).length === 0

    if (object[key] && !isEmptyObject) {
      const value = object[key] as unknown as
        | ExpressionOrValue
        | ExpressionOrValue[]
        | KeyMap<ExpressionOrValue>
      if (Array.isArray(value)) {
        result[snakeCase(key as string)] = value.map((value) =>
          compileExpression(value, context),
        )
      } else if (typeof value === 'object') {
        const obj: Config = {}
        Object.entries(value).forEach(([key, value]) => {
          obj[key] = compileExpression(value, context)
        })
        result[snakeCase(key as string)] = obj
      } else {
        result[snakeCase(key as string)] = compileExpression(value, context)
      }
    }
  })

  return result
}
