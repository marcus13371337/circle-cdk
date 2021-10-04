import { Config } from '../../types/Config'
import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { JobConfig } from './JobConfig'

export class JobMatrix extends ChildEntry<JobConfig> {
  public parameters: Record<string, string[]> = {}
  public excludes: Record<string, string>[] = []
  public alias: string | null = null

  addParameter(parameterName: string, values: string[]) {
    this.parameters[parameterName] = values
    return this
  }

  addExclude(value: Record<string, string>) {
    this.excludes = [...this.excludes, value]
    return this
  }

  getParameterNames() {
    return Object.keys(this.parameters)
  }

  assertValid(context: ChildEntryConfigContext<JobConfig>) {
    if (context.pipeline.version < 2.1) {
      throw new Error('Matrices requires a pipeline higher than ')
    }

    if (!this.getParameterNames().length) {
      throw new Error('A matrix must contain at least a parameter')
    }

    this.excludes.forEach((exclude) => {
      Object.keys(exclude).forEach((parameterName) => {
        if (!this.parameters[parameterName]) {
          throw new Error(
            `${parameterName} is not a recognized parameter in the matrix`,
          )
        }
        if (!this.parameters[parameterName].includes(exclude[parameterName])) {
          throw new Error(
            `${exclude[parameterName]} is not a valid value listed in the parameter definition of ${parameterName}`,
          )
        }
      })

      this.getParameterNames().forEach((parameterName) => {
        if (!exclude[parameterName]) {
          throw new Error(`${parameterName} is missing in the matrix exclude`)
        }
      })
    })
  }

  toConfig(context: ChildEntryConfigContext<JobConfig>) {
    this.assertValid(context)

    const config: Config = pickAttributesToConfig(this, ['parameters', 'alias'])

    if (this.excludes.length) {
      config.exclude = this.excludes
    }

    return config
  }
}
