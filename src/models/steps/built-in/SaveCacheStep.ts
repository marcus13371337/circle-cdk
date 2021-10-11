import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class SaveCacheStep extends Step {
  public name: ExpressionOrValue<string> | null = null
  public when: ExpressionOrValue<string> | null = null

  constructor(
    public paths: ExpressionOrValue<string>[],
    public key: ExpressionOrValue<string>,
  ) {
    super('save_cache')
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return {
      [this.type]: pickAttributesToConfig(
        this,
        ['paths', 'key', 'name', 'when'],
        context,
      ),
    }
  }
}
