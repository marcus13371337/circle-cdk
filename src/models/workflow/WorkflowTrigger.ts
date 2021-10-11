import { Config } from '../../types/Config'
import { customizeObject, Customizer } from '../../utils/customizeObject'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { compileExpression, ExpressionOrValue } from '../variables'
import { Filter } from './Filter'
import { Workflow } from './Workflow'

type Parent = Workflow
export class WorkflowTrigger extends ChildEntry<Parent> {
  public filter: Filter

  constructor(
    public cron: ExpressionOrValue<string>,
    filterCustomizer?: Customizer<Filter>,
  ) {
    super()
    this.filter = customizeObject(new Filter(), filterCustomizer)
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
