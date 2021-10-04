import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class RestoreCacheStep extends Step {
  public key: string | null = null
  public keys: string[] = []
  public name: string | null = null

  constructor() {
    super('restore_cache')
  }

  assertValid() {
    if (!this.key && !this.keys.length) {
      throw new Error('You have to specify key or keys when restoring cache')
    }
  }

  toConfig() {
    this.assertValid()
    return {
      [this.type]: pickAttributesToConfig(this, ['key', 'keys', 'name']),
    }
  }
}
