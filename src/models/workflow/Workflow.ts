import { EntryParameters } from '../../types/EntryParameters'
import { customizeObject, Customizer } from '../../utils/customizeObject'
import { listToConfig } from '../../utils/listToConfig'
import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import {
  BasicLogicStatement,
  compileStatement,
  LogicStatement,
} from '../LogicStatement'
import { Pipeline } from '../Pipeline'
import { JobConfig } from './JobConfig'
import { WorkflowTrigger } from './WorkflowTrigger'

type Parent = Pipeline

export class Workflow extends ChildEntry<Parent> {
  public version: number | null = null
  public triggers: WorkflowTrigger[] = []
  public jobConfigs: JobConfig[] = []
  public when: LogicStatement | BasicLogicStatement | null = null
  public unless: LogicStatement | BasicLogicStatement | null = null

  addTrigger(...params: EntryParameters<typeof WorkflowTrigger>) {
    this.triggers = [...this.triggers, new WorkflowTrigger(...params)]
    return this
  }

  addJobConfig(jobName: string, customize?: Customizer<JobConfig>) {
    const jobConfig = customizeObject(new JobConfig(jobName), customize)
    this.jobConfigs = [...this.jobConfigs, jobConfig]
    return jobConfig
  }

  assertValid() {
    if (!this.jobConfigs.length) {
      throw new Error('A workflow must have at least one job')
    }
  }

  toConfig(context: ChildEntryConfigContext<Parent>) {
    this.assertValid()

    const result = pickAttributesToConfig(this, ['version'], context)

    const newContext = { ...context, parent: this }

    if (this.when) {
      result.when = compileStatement(this.when, newContext)
    }

    if (this.unless) {
      result.unless = compileStatement(this.unless, newContext)
    }

    if (this.triggers.length) {
      result.triggers = listToConfig(this.triggers, newContext)
    }

    if (Object.keys(this.jobConfigs).length) {
      result.jobs = listToConfig(this.jobConfigs, newContext)
    }

    return result
  }
}
