import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { Step } from '../Step'

export class PersistToWorkspaceStep extends Step<'persist_to_workspace'> {
  public root: string
  public paths: string[]

  constructor(root: string, paths: string[]) {
    super('persist_to_workspace')
    this.root = root
    this.paths = paths
  }

  toConfig() {
    return { [this.type]: pickAttributesToConfig(this, ['root', 'paths']) }
  }
}
