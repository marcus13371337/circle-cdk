import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class StoreArtifactsStep extends Step {
  public path: ExpressionOrValue<string>
  public destination: ExpressionOrValue<string> | null = null

  constructor(path: string) {
    super('store_artifacts')
    this.path = path
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return {
      [this.type]: pickAttributesToConfig(
        this,
        ['path', 'destination'],
        context,
      ),
    }
  }
}
