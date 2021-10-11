import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class AttachWorkspaceStep extends Step<'attach_workspace'> {
  constructor(public at: ExpressionOrValue<string>) {
    super('attach_workspace')
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return { [this.type]: pickAttributesToConfig(this, ['at'], context) }
  }
}
