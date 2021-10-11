import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class StoreTestResultsStep extends Step {
  constructor(public path: ExpressionOrValue<string>) {
    super('store_test_results')
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return { [this.type]: pickAttributesToConfig(this, ['path'], context) }
  }
}
