import { Config } from '../types/Config'
import { KeyMap } from '../types/KeyMap'
import { customizeObject, Customizer } from '../utils/customizeObject'
import { listToConfig } from '../utils/listToConfig'
import { ChildEntry, ChildEntryConfigContext } from './Entity'
import { Parameter } from './parameters/Parameter'
import { Pipeline } from './Pipeline'
import { Step } from './steps/Step'

type Parent = Pipeline
export class Command extends ChildEntry<Parent> {
  public steps: Step[] = []
  public parameters: KeyMap<Parameter> = {}
  public description: string | null = null

  addStep<T extends Step>(step: T, customize?: Customizer<T>) {
    this.steps = [...this.steps, customizeObject(step, customize)]
    return this
  }

  addParameter<T extends Parameter>(
    name: string,
    parameter: T,
    customize?: Customizer<Parameter>,
  ) {
    this.parameters[name] = customizeObject(parameter, customize)
    return this
  }

  assertValid() {
    if (!this.steps.length) {
      throw new Error('Command with no steps')
    }
  }

  getParameterNames() {
    return Object.keys(this.parameters)
  }

  toConfig(context: ChildEntryConfigContext<Parent>): Config {
    this.assertValid()

    const result: Config = {}

    const newContext: ChildEntryConfigContext<Command> = {
      ...context,
      parent: this,
      availableParameters: [
        ...context.availableParameters,
        ...Object.keys(this.parameters),
      ],
    }

    if (this.description) {
      result.description = this.description
    }

    result.steps = listToConfig(this.steps, newContext)

    if (Object.keys(this.parameters).length) {
      result.parameters = {}
      for (const [parameterName, parameter] of Object.entries(
        this.parameters,
      )) {
        result.parameters[parameterName] = parameter.toConfig(context)
      }
    }

    return result
  }
}
