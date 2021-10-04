import { ChildEntry, ChildEntryConfigContext } from '../models/Entity'
import { Config } from '../types/Config'

export const recordToConfig = <T>(
  records: Record<string, ChildEntry<T>>,
  context: ChildEntryConfigContext<T>,
) => {
  const result: Config = {}

  for (const [recordName, record] of Object.entries(records)) {
    result[recordName] = record.toConfig(context)
  }

  return result
}
