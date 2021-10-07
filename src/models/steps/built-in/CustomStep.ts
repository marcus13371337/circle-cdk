import { ChildEntryConfigContext } from '../../Entity'
import { Step, StepParent } from '../Step'

export class CustomStep extends Step {
  public params: Record<string, string | boolean | number>
  constructor(
    type: string,
    params: Record<string, string | boolean | number> = {},
  ) {
    super(type)
    this.params = params
  }

  private assertValid(context: ChildEntryConfigContext<StepParent>) {
    const orbsCommand = this.type.split('/')
    if (orbsCommand.length > 1) {
      const orbName = orbsCommand[0]
      if (!context.pipeline.getOrb(orbName)) {
        throw new Error(
          `Trying to use orb: ${orbName} which is not listed as an orb in the pipeline`,
        )
      }
    } else {
      const command = orbsCommand[0]
      const commandEntry = context.pipeline.getCommand(command)
      if (!commandEntry) {
        throw new Error(
          `Tying to execute command: ${command} which is not listed as a command in the pipeline`,
        )
      }

      Object.entries(commandEntry.parameters).forEach(
        ([parameterName, parameterDefinition]) => {
          const isRequired = parameterDefinition.default !== null
          if (isRequired) {
            const value = this.params[parameterName]
            if (!value) {
              throw new Error(
                `Missing parameter: ${parameterName} when calling command: ${command}`,
              )
            }
          }
        },
      )

      const parameterNames = Object.keys(commandEntry.parameters)
      Object.keys(this.params).forEach((parameterName) => {
        if (!parameterNames.includes(parameterName)) {
          throw new Error(
            `Unknown paramter: ${parameterName} when calling command: ${command}`,
          )
        }
      })
    }
  }

  toConfig(context: ChildEntryConfigContext<StepParent>) {
    this.assertValid(context)

    return Object.keys(this.params)
      ? {
          [this.type]: this.params,
        }
      : this.type
  }
}
