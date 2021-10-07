import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class RestoreCacheStep extends Step {
  public key: ExpressionOrValue<string> | null = null
  public keys: ExpressionOrValue<string>[] = []
  public name: ExpressionOrValue<string> | null = null

  constructor() {
    super('restore_cache')
  }

  assertValid() {
    if (!this.key && !this.keys.length) {
      throw new Error('You have to specify key or keys when restoring cache')
    }
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    this.assertValid()
    return {
      [this.type]: pickAttributesToConfig(
        this,
        ['key', 'keys', 'name'],
        context,
      ),
    }
  }
}
