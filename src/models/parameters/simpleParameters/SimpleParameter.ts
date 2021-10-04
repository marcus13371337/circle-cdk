import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Parameter } from '../Parameter'

export abstract class SimpleParameter extends Parameter {
  toConfig() {
    const result = pickAttributesToConfig(this, ['description'])

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
