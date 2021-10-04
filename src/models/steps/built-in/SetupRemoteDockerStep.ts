import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class SetupRemoteDockerStep extends Step {
  public dockerLayerCaching = false
  public version: string | null = null

  constructor() {
    super('setup_remote_docker')
  }

  toConfig() {
    const result = pickAttributesToConfig(this, [
      'dockerLayerCaching',
      'version',
    ])

    return Object.keys(result).length > 0 ? { [this.type]: result } : this.type
  }
}
