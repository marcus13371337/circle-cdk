import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { ExpressionOrValue } from '../../variables'
import { Step, StepParent } from '../Step'

export class AttachWorkspaceStep extends Step<'attach_workspace'> {
  public at: ExpressionOrValue<string>

  constructor(at: ExpressionOrValue<string>) {
    super('attach_workspace')
    this.at = at
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    return { [this.type]: pickAttributesToConfig(this, ['at'], context) }
  }
}
