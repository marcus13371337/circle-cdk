import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { Command } from '../Command'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { Job } from '../Job'
import { Pipeline } from '../Pipeline'

export type ParameterParent = Job | Command | Pipeline
export abstract class Parameter<
  D extends string | number | boolean = string | number | boolean,
> extends ChildEntry<ParameterParent> {
  protected type: string
  public description: string | null = null
  public default: D | null = null

  constructor(type: string) {
    super()
    this.type = type
  }

  toConfig(context: ChildEntryConfigContext<ParameterParent>) {
    const result = pickAttributesToConfig(this, ['description'], context)

    if (this.default !== null) {
      result.default = this.default
    }

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
