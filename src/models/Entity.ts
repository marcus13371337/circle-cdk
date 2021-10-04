import { Config } from '../types/Config'
import YAML from 'yaml'
import { Pipeline } from './Pipeline'

export abstract class Entry {
  abstract toConfig(): Config
  toConfigString() {
    return YAML.stringify(this.toConfig())
  }
}

export interface ChildEntryConfigContext<T> {
  pipeline: Pipeline
  parent: T
  availableParameters: string[]
}

export abstract class ChildEntry<T> {
  abstract toConfig(context: ChildEntryConfigContext<T>): Config
}
