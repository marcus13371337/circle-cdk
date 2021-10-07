import { Config } from '../../types/Config'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { compileExpression, ExpressionOrValue } from '../variables'
import { Filter } from './Filter'
import { Workflow } from './Workflow'

type Parent = Workflow
export class WorkflowTrigger extends ChildEntry<Parent> {
  public cron: ExpressionOrValue<string>
  public filter: Filter

  constructor(cron: string, filter: Filter) {
    super()
    this.cron = cron
    this.filter = filter
  }

  toConfig(context: ChildEntryConfigContext<Parent>) {
    const result: Config = { cron: compileExpression(this.cron, context) }

    const filterConfig = this.filter.toConfig(context)
    if (Object.keys(filterConfig).length) {
      result.filters = { branches: this.filter.toConfig(context) }
    }

    return result
  }
}
