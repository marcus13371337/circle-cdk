import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { SimpleParameter } from './SimpleParameter'

export class StringParameter extends SimpleParameter {
  public default: string | null = null

  constructor() {
    super('string')
  }

  toConfig() {
    const result = pickAttributesToConfig(this, ['description', 'default'])

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
