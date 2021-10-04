import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { Compiler, isCompiler } from '../../Variables'
import { Step, StepParent } from '../Step'

export class RunStep extends Step {
  public command: string | Compiler
  public name: string | null = null
  public shell: string | null = null
  public environment: Record<string, string> = {}
  public background = false
  public workingDirectory: string | null = null
  public noOutputTimeout: string | null = null
  public when: 'always' | 'on_success' | 'on_fail' | null = null

  constructor(command: string | Compiler) {
    super('run')
    this.command = command
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    const result = pickAttributesToConfig(this, [
      'name',
      'shell',
      'environment',
      'background',
      'workingDirectory',
      'noOutputTimeout',
      'when',
    ])

    const compiledCommand = isCompiler(this.command)
      ? this.command({
          pipelineParameterNames: context.pipeline.getParameterNames(),
          parameterNames: context.availableParameters,
        })
      : this.command

    return Object.keys(result).length > 0
      ? {
          command: compiledCommand,
          ...result,
        }
      : compiledCommand
  }
}
