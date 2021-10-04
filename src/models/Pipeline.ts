import { Command } from './Command'
import { Executor } from './executor/Executor'
import { Orb } from './Orb'
import { Parameter } from './parameters/Parameter'
import { Workflow } from './workflow/Workflow'
import { Entry } from './Entity'
import { Config } from '../types/Config'
import { listToConfig } from '../utils/listToConfig'
import { recordToConfig } from '../utils/recordToConfig'
import { Job } from './Job'
import { EntryParameters } from '../types/EntryParameters'

export type Version = 2 | 2.0 | 2.1

export class Pipeline extends Entry {
  public setup = false
  public version: Version = 2.1
  private orbs: Record<string, Orb> = {}
  private commands: Command[] = []
  private parameters: Record<string, Parameter> = {}
  private executors: Record<string, Executor> = {}
  private jobs: Record<string, Job> = {}
  private workflows: Record<string, Workflow> = {}

  public addOrb(name: string, ...orbParams: EntryParameters<typeof Orb>) {
    const orb = new Orb(...orbParams)
    this.orbs[name] = orb
    return orb
  }

  public addCommand(command: Command) {
    this.commands = [...this.commands, command]
    return this
  }

  public addParameter(name: string, parameter: Parameter) {
    this.parameters[name] = parameter
    return this
  }

  public addExecutor(
    executorName: string,
    ...executorParams: EntryParameters<typeof Executor>
  ) {
    const executor = new Executor(...executorParams)
    this.executors[executorName] = executor
    return executor
  }

  public addJob(
    jobName: string,
    ...jobParameters: EntryParameters<typeof Executor>
  ) {
    const job = new Job(...jobParameters)
    this.jobs[jobName] = job
    return job
  }

  public addWorkflow(workflowName: string) {
    const workflow = new Workflow()
    this.workflows[workflowName] = workflow
    return workflow
  }

  public getParameterNames() {
    return Object.keys(this.parameters)
  }

  private assertValid() {
    if (this.version < 2.1) {
      if (Object.keys(this.orbs).length) {
        throw new Error('Orbs are not supported when version <2.1')
      }
      if (Object.keys(this.parameters).length) {
        throw new Error('Parameters are not supported when version <2.1')
      }
      if (this.executors.length) {
        throw new Error('Executors are not supported when version <2.1')
      }
      if (this.commands.length) {
        throw new Error('Commands are not supported when version <2.1')
      }
    }
  }

  public toConfig() {
    this.assertValid()

    const newParams = {
      pipeline: this,
      parent: this,
      availableParameters: [],
    }

    const result: Config = {
      version: this.version,
    }

    if (this.setup) {
      result.setup = this.setup
    }

    if (this.commands.length) {
      result.commands = listToConfig(this.commands, newParams)
    }

    if (Object.keys(this.parameters).length) {
      result.parameters = recordToConfig(this.parameters, newParams)
    }

    if (Object.keys(this.executors).length) {
      result.executors = recordToConfig(this.executors, newParams)
    }

    if (Object.keys(this.orbs).length) {
      result.orbs = recordToConfig(this.orbs, newParams)
    }

    if (Object.keys(this.workflows).length) {
      result.workflows = recordToConfig(this.workflows, newParams)
    }

    if (Object.keys(this.jobs).length) {
      result.jobs = recordToConfig(this.jobs, newParams)
    }

    return result
  }
}
