import { Config } from '../types/Config'
import { listToConfig } from '../utils/listToConfig'
import { ChildEntry, ChildEntryConfigContext } from './Entity'
import { Parameter } from './parameters/Parameter'
import { Pipeline } from './Pipeline'
import { Step } from './steps/Step'

export class Command extends ChildEntry<Pipeline> {
  public steps: Step[] = []
  public parameters: Record<string, Parameter> = {}
  public description: string | null = null

  addStep(step: Step) {
    this.steps = [...this.steps, step]
    return this
  }

  addParameter(name: string, parameter: Parameter) {
    this.parameters[name] = parameter
  }

  assureValid() {
    if (!this.steps.length) {
      throw new Error('Command with no steps')
    }
  }

  getParameterNames() {
    return Object.keys(this.parameters)
  }

  toConfig(context: ChildEntryConfigContext<Pipeline>): Config {
    this.assureValid()

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

    if (this.parameters.length) {
      result.parameters = {}
      for (const [parameterName, parameter] of Object.entries(
        this.parameters,
      )) {
        result.parameters[parameterName] = parameter.toConfig(newContext)
      }
    }

    return result
  }
}
