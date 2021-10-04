import { Config } from '../../../types/Config'
import { Step } from '../Step'

export class CustomStep extends Step {
  public params: Config
  constructor(type: string, params: Config = {}) {
    super(type)
    this.params = params
  }

  toConfig() {
    return Object.keys(this.params)
      ? {
          [this.type]: this.params,
        }
      : this.type
  }
}
