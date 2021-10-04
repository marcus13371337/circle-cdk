import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { SimpleParameter } from './SimpleParameter'

export class IntegerParameter extends SimpleParameter {
  public default: number | null = null

  constructor() {
    super('integer')
  }

  toConfig() {
    const result = pickAttributesToConfig(this, ['description', 'default'])

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
