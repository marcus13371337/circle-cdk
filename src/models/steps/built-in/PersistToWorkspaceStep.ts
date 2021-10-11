import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class PersistToWorkspaceStep extends Step<'persist_to_workspace'> {
  constructor(
    public root: ExpressionOrValue<string>,
    public paths: ExpressionOrValue<string>[],
  ) {
    super('persist_to_workspace')
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return {
      [this.type]: pickAttributesToConfig(this, ['root', 'paths'], context),
    }
  }
}
