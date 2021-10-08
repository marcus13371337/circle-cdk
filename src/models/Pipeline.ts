import { Command } from './Command'
import { Executor } from './executor/Executor'
import { Orb } from './Orb'
import { Parameter } from './parameters/Parameter'
import { Workflow } from './workflow/Workflow'
import { Entry } from './Entity'
import { Config } from '../types/Config'
import { recordToConfig } from '../utils/recordToConfig'
import { Job } from './Job'
import { EntryParameters } from '../types/EntryParameters'
import { KeyMap } from '../types/KeyMap'

export type Version = 2 | 2.0 | 2.1

export class Pipeline extends Entry {
  public setup = false
  public version: Version = 2.1
  private orbs: KeyMap<Orb> = {}
  private commands: KeyMap<Command> = {}
  private parameters: KeyMap<Parameter> = {}
  private executors: KeyMap<Executor> = {}
  private jobs: KeyMap<Job> = {}
  private workflows: KeyMap<Workflow> = {}

  public addOrb(name: string, ...orbParams: EntryParameters<typeof Orb>) {
    const orb = new Orb(...orbParams)
    this.orbs[name] = orb
    return orb
  }

  public getOrb(name: string) {
    return this.orbs[name]
  }

  public addCommand(
    commandName: string,
    ...commandParams: EntryParameters<typeof Command>
  ) {
    const command = new Command(...commandParams)
    this.commands[commandName] = command
    return command
  }

  public getCommand(name: string) {
    return this.commands[name]
  }

  public addParameter(name: string, parameter: Parameter) {
    this.parameters[name] = parameter
    return this
  }

  public getParameterNames() {
    return Object.keys(this.parameters)
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

  public getJobs() {
    return this.jobs
  }

  public addWorkflow(workflowName: string) {
    const workflow = new Workflow()
    this.workflows[workflowName] = workflow
    return workflow
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

    const context = {
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
      result.commands = recordToConfig(this.commands, context)
    }

    if (Object.keys(this.parameters).length) {
      result.parameters = recordToConfig(this.parameters, context)
    }

    if (Object.keys(this.executors).length) {
      result.executors = recordToConfig(this.executors, context)
    }

    if (Object.keys(this.orbs).length) {
      result.orbs = recordToConfig(this.orbs, context)
    }

    if (Object.keys(this.workflows).length) {
      result.workflows = recordToConfig(this.workflows, context)
    }

    if (Object.keys(this.jobs).length) {
      result.jobs = recordToConfig(this.jobs, context)
    }

    if (Object.keys(this.commands).length) {
      result.commands = recordToConfig(this.commands, context)
    }

    return result
  }
}
