import { Config } from '../types/Config'
import { EntryParameters } from '../types/EntryParameters'
import { listToConfig } from '../utils/listToConfig'
import { pickAttributesToConfig } from '../utils/pickAttributesToConfig'
import { recordToConfig } from '../utils/recordToConfig'
import { ChildEntry, ChildEntryConfigContext } from './Entity'
import { Docker } from './executor/machines/Docker'
import { Machine } from './executor/machines/Machine'
import { MacOS } from './executor/machines/MacOS'
import { SimpleParameter } from './parameters/simpleParameters/SimpleParameter'
import { Pipeline } from './Pipeline'
import { Step } from './steps/Step'

export class Job extends ChildEntry<Pipeline> {
  private docker: Docker[] = []
  private machine: Record<string, Machine> = {}
  private macos: Record<string, MacOS> = {}
  public shell: string | null = null
  private parameters: Record<string, SimpleParameter> = {}
  public steps: Step[] = []
  public workingDirectory: string | null = null
  public parallelism: number | null = null
  public environment: Record<string, string> = {}
  public resourceClass: string | null = null
  public circleciIpRanges = false

  addStep(step: Step) {
    this.steps = [...this.steps, step]
    return this
  }

  addDocker(...params: EntryParameters<typeof Docker>) {
    const docker = new Docker(...params)
    this.docker = [...this.docker, docker]
    return docker
  }

  addMachine(machineName: string, ...params: EntryParameters<typeof Machine>) {
    const machine = new Machine(...params)
    this.machine[machineName] = machine
    return machine
  }

  addMacOS(macOSName: string, ...params: EntryParameters<typeof MacOS>) {
    const macOS = new MacOS(...params)
    this.macos[macOSName] = macOS
    return macOS
  }

  addParameter(parameterName: string, parameter: SimpleParameter) {
    this.parameters[parameterName] = parameter
    return this
  }

  assertValid() {
    if (!this.steps.length) {
      throw new Error('A job must include at least on step')
    }

    if (
      this.docker.length +
        Object.keys(this.machine).length +
        Object.keys(this.macos).length !=
      1
    ) {
      throw new Error('Must have exactly one of docker, machine or macos')
    }
  }

  toConfig(context: ChildEntryConfigContext<Pipeline>) {
    this.assertValid()

    const newContext: ChildEntryConfigContext<Job> = {
      ...context,
      parent: this,
      availableParameters: [
        ...context.availableParameters,
        ...Object.keys(this.parameters),
      ],
    }

    const result: Config = {
      ...pickAttributesToConfig(this, [
        'shell',
        'workingDirectory',
        'parallelism',
        'environment',
        'resourceClass',
        'circleciIpRanges',
      ]),
    }

    if (this.docker.length) {
      result.docker = listToConfig(this.docker, newContext)
    }

    if (Object.keys(this.machine).length) {
      result.machine = recordToConfig(this.machine, newContext)
    }

    if (Object.keys(this.macos).length) {
      result.macos = recordToConfig(this.macos, newContext)
    }

    if (Object.keys(this.parameters).length) {
      result.parameters = recordToConfig(this.parameters, newContext)
    }

    result.steps = listToConfig(this.steps, newContext)

    return result
  }
}
