import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class AttachWorkspaceStep extends Step<'attach_workspace'> {
  public at: string

  constructor(at: string) {
    super('attach_workspace')
    this.at = at
  }

  toConfig() {
    return { [this.type]: pickAttributesToConfig(this, ['at']) }
  }
}
