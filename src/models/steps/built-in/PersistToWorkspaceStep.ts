import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class PersistToWorkspaceStep extends Step<'persist_to_workspace'> {
  public root: ExpressionOrValue<string>
  public paths: ExpressionOrValue<string>[]

  constructor(
    root: ExpressionOrValue<string>,
    paths: ExpressionOrValue<string>[],
  ) {
    super('persist_to_workspace')
    this.root = root
    this.paths = paths
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return {
      [this.type]: pickAttributesToConfig(this, ['root', 'paths'], context),
    }
  }
}
