import { Config } from '../../types/Config'
import { EntryParameters } from '../../types/EntryParameters'
import { KeyMap } from '../../types/KeyMap'
import { listToConfig } from '../../utils/listToConfig'
import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { recordToConfig } from '../../utils/recordToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { Pipeline } from '../Pipeline'
import { ExpressionOrValue } from '../variables'
import { Docker } from './machines/Docker'
import { Machine } from './machines/Machine'
import { MacOS } from './machines/MacOS'
import { Windows } from './machines/Windows'

type Parent = Pipeline

export class Executor extends ChildEntry<Parent> {
  private docker: Docker[] = []
  private machine: KeyMap<Machine> = {}
  private macos: KeyMap<MacOS> = {}
  private windows: KeyMap<Windows> = {}
  public resourceClass: ExpressionOrValue<string> | null = null
  public shell: ExpressionOrValue<string> | null = null
  public workingDirectory: ExpressionOrValue<string> | null = null
  public environment: KeyMap<ExpressionOrValue> = {}

  public addDocker(...dockerParams: EntryParameters<typeof Docker>) {
    const docker = new Docker(...dockerParams)
    this.docker = [...this.docker, docker]
    return docker
  }

  public addMachine(
    name: string,
    ...machineParams: EntryParameters<typeof Machine>
  ) {
    const machine = new Machine(...machineParams)
    this.machine[name] = machine
    return machine
  }

  public addMacOS(name: string, ...macOSParams: EntryParameters<typeof MacOS>) {
    const macOS = new MacOS(...macOSParams)
    this.macos[name] = macOS
    return macOS
  }

  public addWindows(
    name: string,
    ...windowsParams: EntryParameters<typeof Windows>
  ) {
    const windows = new Windows(...windowsParams)
    this.windows[name] = windows
    return windows
  }

  assertValid() {
    if (
      this.docker.length +
        Object.keys(this.machine).length +
        Object.keys(this.macos).length +
        Object.keys(this.windows).length !=
      1
    ) {
      throw new Error(
        'Exactly one of docker, machine, macos or windows needs to be specified in an executor',
      )
    }
  }

  toConfig(context: ChildEntryConfigContext<Parent>) {
    this.assertValid()

    const newContext: ChildEntryConfigContext<Executor> = {
      ...context,
      parent: this,
    }

    const result: Config = pickAttributesToConfig(
      this,
      ['resourceClass', 'shell', 'workingDirectory', 'environment'],
      context,
    )

    if (this.docker.length) {
      result.docker = listToConfig(this.docker, newContext)
    }

    if (Object.keys(this.machine).length) {
      result.machine = recordToConfig(this.machine, newContext)
    }

    if (Object.keys(this.macos).length) {
      result.macos = recordToConfig(this.macos, newContext)
    }

    if (Object.keys(this.windows).length) {
      result.windows = recordToConfig(this.windows, newContext)
    }

    return result
  }
}