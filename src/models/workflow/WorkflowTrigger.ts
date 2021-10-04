import { Config } from '../../types/Config'
import { ChildEntry } from '../Entity'
import { Filter } from './Filter'
import { Workflow } from './Workflow'

export class WorkflowTrigger extends ChildEntry<Workflow> {
  public cron: string
  public filter: Filter

  constructor(cron: string, filter: Filter) {
    super()
    this.cron = cron
    this.filter = filter
  }

  toConfig() {
    const result: Config = { cron: this.cron }

    const filterConfig = this.filter.toConfig()
    if (Object.keys(filterConfig).length) {
      result.filters = { branches: this.filter.toConfig() }
    }

    return result
  }
}
