import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class StoreTestResultsStep extends Step {
  public path: ExpressionOrValue<string>

  constructor(path: string) {
    super('store_test_results')
    this.path = path
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return { [this.type]: pickAttributesToConfig(this, ['path'], context) }
  }
}
