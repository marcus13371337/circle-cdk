import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class StoreArtifactsStep extends Step {
  public destination: ExpressionOrValue<string> | null = null

  constructor(public path: ExpressionOrValue<string>) {
    super('store_artifacts')
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
