import { customizeObject, Customizer } from '../../utils/customizeObject'
import { listToConfig } from '../../utils/listToConfig'
import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { Step } from '../steps/Step'
import { compileExpression, ExpressionOrValue } from '../variables'
import { Filter } from './Filter'
import { JobMatrix } from './JobMatrix'
import { Workflow } from './Workflow'

type Parent = Workflow

export class JobConfig extends ChildEntry<Parent> {
  public name: string | null = null
  public requires: string[] = []
  public contexts: string[] = []
  public type: 'approval' | null = null
  public branchFilter: Filter | null = null
  public tagFilter: Filter | null = null
  private matrix: JobMatrix | null = null
  public preSteps: Step[] = []
  public postSteps: Step[] = []
  public parameters: Record<string, ExpressionOrValue> = {}

  constructor(public jobName: string) {
    super()
  }

  addRequire(name: string) {
    this.requires = [...this.requires, name]
    return this
  }

  addContext(context: string) {
    this.contexts = [...this.contexts, context]
    return this
  }

  addPreStep<T extends Step>(step: T, customize?: Customizer<T>) {
    this.preSteps = [...this.preSteps, customizeObject(step, customize)]
    return this
  }

  addPostStep<T extends Step>(step: T, customize?: Customizer<T>) {
    this.postSteps = [...this.postSteps, customizeObject(step, customize)]
    return this
  }

  addMatrix(customize?: Customizer<JobMatrix>) {
    this.matrix = customizeObject(new JobMatrix(), customize)
    return this.matrix
  }

  addParameter(parameterName: string, value: ExpressionOrValue) {
    this.parameters[parameterName] = value
    return this
  }

  private assertValid(context: ChildEntryConfigContext<Parent>) {
    const pipelineJobs = context.pipeline.getJobs()

    if (!pipelineJobs[this.jobName]) {
      throw new Error(`Job ${this.jobName} is not defined in pipeline`)
    }
  }

  toConfig(context: ChildEntryConfigContext<Parent>) {
    this.assertValid(context)

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

    if (this.preSteps.length) {
      config['pre-steps'] = listToConfig(this.preSteps, newContext)
    }
    if (this.postSteps.length) {
      config['post-steps'] = listToConfig(this.postSteps, newContext)
    }

    if (Object.keys(this.parameters).length) {
      Object.entries(this.parameters).forEach(
        ([parameterName, parameterValue]) => {
          config[parameterName] = compileExpression(parameterValue, newContext)
        },
      )
    }

    return Object.keys(config).length > 0
      ? {
          [this.jobName]: config,
        }
      : this.jobName
  }
}
