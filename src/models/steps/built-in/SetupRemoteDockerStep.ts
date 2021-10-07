import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class SetupRemoteDockerStep extends Step {
  public dockerLayerCaching: ExpressionOrValue<boolean> | null = null
  public version: ExpressionOrValue<string> | null = null

  constructor() {
    super('setup_remote_docker')
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    const result = pickAttributesToConfig(
      this,
      ['dockerLayerCaching', 'version'],
      context,
    )

    return Object.keys(result).length > 0 ? { [this.type]: result } : this.type
  }
}
