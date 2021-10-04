import { Config } from '../../../types/Config'
import { listToConfig } from '../../../utils/listToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import {
  BasicLogicStatement,
  compile,
  LogicStatement,
} from '../../LogicStatement'
import { Step, StepConfigParams } from '../Step'

export class WhenStep extends Step {
  public condition: LogicStatement | BasicLogicStatement
  public steps: Step[] = []

  constructor(condition: LogicStatement | BasicLogicStatement) {
    super('when')
    this.condition = condition
  }

  addStep(step: Step) {
    this.steps = [...this.steps, step]
  }

  assertValid() {
    if (!this.steps.length) {
      throw new Error('No steps provided to when-step')
    }
  }

  toConfig(context: StepConfigParams): Config {
    this.assertValid()

    const newContext: ChildEntryConfigContext<WhenStep> = {
      ...context,
      parent: this,
    }

    return {
      condition: compile(this.condition, newContext),
      steps: listToConfig(this.steps, newContext),
    }
  }
}
