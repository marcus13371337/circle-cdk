import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { SimpleParameter } from './SimpleParameter'

export class BooleanParamter extends SimpleParameter {
  public default: boolean | null = null

  constructor() {
    super('boolean')
  }

  toConfig() {
    const result = pickAttributesToConfig(this, ['description'])

    if (this.default !== null) {
      result.default = this.default
    }

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
