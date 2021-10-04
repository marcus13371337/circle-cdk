import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class StoreTestResultsStep extends Step {
  public path: string

  constructor(path: string) {
    super('store_test_results')
    this.path = path
  }

  toConfig() {
    return { [this.type]: pickAttributesToConfig(this, ['path']) }
  }
}
