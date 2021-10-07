import { KeyMap } from '../../../types/KeyMap'
import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import {
  compileExpression,
  Expression,
  ExpressionOrValue,
} from '../../variables'
import { Step, StepParent } from '../Step'

export class RunStep extends Step {
  public command: ExpressionOrValue<string>
  public name: ExpressionOrValue<string> | null = null
  public shell: ExpressionOrValue<string> | null = null
  public environment: KeyMap<ExpressionOrValue> = {}
  public background: ExpressionOrValue<boolean> | null = null
  public workingDirectory: ExpressionOrValue<string> | null = null
  public noOutputTimeout: ExpressionOrValue<string> | null = null
  public when: ExpressionOrValue<'always' | 'on_success' | 'on_fail'> | null =
    null

  constructor(command: string | Expression) {
    super('run')
    this.command = command
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    const result = pickAttributesToConfig(
      this,
      [
        'name',
        'shell',
        'environment',
        'background',
        'workingDirectory',
        'noOutputTimeout',
        'when',
      ],
      context,
    )

    const compiledCommand = compileExpression(this.command, context)

    return Object.keys(result).length > 0
      ? {
          command: compiledCommand,
          ...result,
        }
      : compiledCommand
  }
}
