import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class AddSSHKeysStep extends Step<'add_ssh_keys'> {
  constructor(public fingerprints: ExpressionOrValue<string>[]) {
    super('add_ssh_keys')
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    const result = pickAttributesToConfig(this, ['fingerprints'], context)

    return Object.keys(result).length > 0 ? { [this.type]: result } : this.type
  }
}
