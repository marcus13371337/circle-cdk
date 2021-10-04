import { EntryParameters } from '../../types/EntryParameters'
import { listToConfig } from '../../utils/listToConfig'
import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { BasicLogicStatement, compile, LogicStatement } from '../LogicStatement'
import { Pipeline } from '../Pipeline'
import { JobConfig } from './JobConfig'
import { WorkflowTrigger } from './WorkflowTrigger'

export class Workflow extends ChildEntry<Pipeline> {
  public version = '2'
  public triggers: WorkflowTrigger[] = []
  public jobs: Array<JobConfig> = []
  public when: LogicStatement | BasicLogicStatement | null = null
  public unless: LogicStatement | BasicLogicStatement | null = null

  addTrigger(...params: EntryParameters<typeof WorkflowTrigger>) {
    this.triggers = [...this.triggers, new WorkflowTrigger(...params)]
    return this
  }

  addJob(jobName: string) {
    const job = new JobConfig(jobName)
    this.jobs = [...this.jobs, job]
    return job
  }

  assertValid() {
    if (!this.jobs.length) {
      throw new Error('A workflow must have at least one job')
    }
  }

  toConfig(params: ChildEntryConfigContext<Pipeline>) {
    this.assertValid()

    const result = pickAttributesToConfig(this, ['version'])

    const newParams = { ...params, parent: this }

    if (this.when) {
      result.when = compile(this.when, newParams)
    }

    if (this.unless) {
      result.unless = compile(this.unless, newParams)
    }

    if (this.triggers.length) {
      result.triggers = listToConfig(this.triggers, newParams)
    }

    if (Object.keys(this.jobs).length) {
      result.jobs = listToConfig(this.jobs, newParams)
    }

    return result
  }
}
