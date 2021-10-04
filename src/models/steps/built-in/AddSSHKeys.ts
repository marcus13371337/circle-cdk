import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class AddSSHKeysStep extends Step<'add_ssh_keys'> {
  public fingerprints: string[] | null = null

  constructor() {
    super('add_ssh_keys')
  }

  toConfig() {
    const result = pickAttributesToConfig(this, ['fingerprints'])

    return Object.keys(result).length > 0 ? { [this.type]: result } : this.type
  }
}
