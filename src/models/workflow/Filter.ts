import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { ExpressionOrValue } from '../variables'
import { JobConfig } from './JobConfig'
import { Workflow } from './Workflow'

type Parent = Workflow | JobConfig
export class Filter extends ChildEntry<Parent> {
  public only: ExpressionOrValue<string> | ExpressionOrValue<string>[] | null =
    null
  public ignore:
    | ExpressionOrValue<string>
    | ExpressionOrValue<string>[]
    | null = null

  toConfig(context: ChildEntryConfigContext<Parent>) {
    return pickAttributesToConfig(this, ['only', 'ignore'], context)
  }
}
