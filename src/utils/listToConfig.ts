import { ChildEntry, ChildEntryConfigContext } from '../models/Entity'

export const listToConfig = <T>(
  entries: ChildEntry<T>[],
  params: ChildEntryConfigContext<T>,
) => entries.map((entry) => entry.toConfig(params))
