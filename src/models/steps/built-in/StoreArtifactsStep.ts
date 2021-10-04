import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class StoreArtifactsStep extends Step {
  public path: string
  public destination: string | null = null

  constructor(path: string) {
    super('store_artifacts')
    this.path = path
  }

  toConfig() {
    return {
      [this.type]: pickAttributesToConfig(this, ['path', 'destination']),
    }
  }
}
