import { Config } from '../types/Config'
import YAML from 'yaml'
import { strOptions } from 'yaml/types'
import { Pipeline } from './Pipeline'

export abstract class Entry {
  abstract toConfig(): Config
  toConfigString() {
    const previousLineWidth = strOptions.fold.lineWidth
    strOptions.fold.lineWidth = 0
    const yamlString = YAML.stringify(this.toConfig())
    strOptions.fold.lineWidth = previousLineWidth

    return yamlString
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
