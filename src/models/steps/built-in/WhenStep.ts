import { Config } from '../../../types/Config'
import { customizeObject, Customizer } from '../../../utils/customizeObject'
import { listToConfig } from '../../../utils/listToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { compileStatement, Statement } from '../../LogicStatement'
import { Step, StepConfigParams } from '../Step'

export class WhenStep extends Step {
  public condition: Statement
  public steps: Step[] = []

  constructor(condition: Statement) {
    super('when')
    this.condition = condition
  }

  addStep<T extends Step>(step: T, customize?: Customizer<T>) {
    this.steps = [...this.steps, customizeObject(step, customize)]
    return this
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
      condition: compileStatement(this.condition, newContext),
      steps: listToConfig(this.steps, newContext),
    }
  }
}
