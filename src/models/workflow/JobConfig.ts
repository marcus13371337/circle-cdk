import { listToConfig } from '../../utils/listToConfig'
import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { Step } from '../steps/Step'
import { Filter } from './Filter'
import { JobMatrix } from './JobMatrix'
import { Workflow } from './Workflow'

type Parent = Workflow

export class JobConfig extends ChildEntry<Parent> {
  public jobName: string
  public name: string | null = null
  public requires: string[] = []
  public contexts: string[] = []
  public type: 'approval' | null = null
  public branchFilter: Filter | null = null
  public tagFilter: Filter | null = null
  private matrix: JobMatrix | null = null
  public preSteps: Step[] = []
  public postSteps: Step[] = []

  constructor(jobName: string) {
    super()
    this.jobName = jobName
  }

  addRequire(name: string) {
    this.requires = [...this.requires, name]
    return this
  }

  addContext(context: string) {
    this.contexts = [...this.contexts, context]
    return this
  }

  addPreStep(step: Step) {
    this.preSteps = [...this.preSteps, step]
    return this
  }

  addPostStep(step: Step) {
    this.postSteps = [...this.postSteps, step]
    return this
  }

  addMatrix() {
    this.matrix = new JobMatrix()
    return this.matrix
  }

  toConfig(context: ChildEntryConfigContext<Parent>) {
    const config = pickAttributesToConfig(this, ['name', 'type'], context)

    const newContext: ChildEntryConfigContext<JobConfig> = {
      ...context,
      parent: this,
      availableParameters: [
        ...context.availableParameters,
        ...(this.matrix ? this.matrix.getParameterNames() : []),
      ],
    }

    if (this.requires.length) {
      config.requires = this.requires
    }

    if (this.contexts.length) {
      config.context = this.contexts
    }

    if (this.branchFilter || this.tagFilter) {
      config.filters = {}

      if (this.branchFilter) {
        config.filters.branches = this.branchFilter.toConfig(newContext)
      }

      if (this.tagFilter) {
        config.filters.tags = this.tagFilter.toConfig(newContext)
      }
    }

    if (this.matrix) {
      config.matrix = this.matrix.toConfig(newContext)
    }

    if (this.preSteps) {
      config['pre-steps'] = listToConfig(this.preSteps, newContext)
    }
    if (this.postSteps) {
      config['post-steps'] = listToConfig(this.postSteps, newContext)
    }

    return Object.keys(config).length > 0
      ? {
          [this.jobName]: config,
        }
      : this.jobName
  }
}
