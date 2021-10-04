import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class SaveCacheStep extends Step {
  public paths: string[]
  public key: string
  public name: string | null = null
  public when: string | null = null

  constructor(paths: string[], key: string) {
    super('save_cache')
    this.paths = paths
    this.key = key
  }

  toConfig() {
    return {
      [this.type]: pickAttributesToConfig(this, [
        'paths',
        'key',
        'name',
        'when',
      ]),
    }
  }
}
