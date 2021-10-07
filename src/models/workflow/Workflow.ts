import { EntryParameters } from '../../types/EntryParameters'
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

    if (Object.keys(this.jobs).length) {
      result.jobs = listToConfig(this.jobs, newContext)
    }

    return result
  }
}
