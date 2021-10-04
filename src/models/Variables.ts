import { snakeCase } from 'change-case'

const escape = (name: string) => `<< ${name} >>`

type Parameters = Record<string, string>

interface PipelineVariables {
  id: string
  number: string
  project: {
    gitUrl: string
    type: string
  }
  git: {
    tag: string
    branch: string
    revision: string
    baseRevision: string
  }
  parameters: Parameters
}

interface AvailableVariables {
  pipeline: PipelineVariables
  parameters: Parameters
}

export type Compiler = (params: {
  pipelineParameterNames: string[]
  parameterNames: string[]
}) => string

export const isCompiler = (
  compiler: Compiler | string | number | boolean,
): compiler is Compiler => typeof compiler === 'function'

const createParametersProxy = (
  availableNames: string[],
  prefix: string,
): Parameters => {
  const obj = new Proxy(
    {},
    {
      get(target, name) {
        const nameString = String(name)
        if (!availableNames.includes(nameString)) {
          throw new Error(`Unknown parameter: ${nameString}`)
        }
        return escape(`${prefix}.${nameString}`)
      },
    },
  )

  return obj
}

export class Variables {
  public static build(builder: (args: AvailableVariables) => string): Compiler {
    return ({ pipelineParameterNames, parameterNames }) => {
      const pipelineParameters = createParametersProxy(
        pipelineParameterNames,
        'pipeline.parameters',
      )

      const parameters = createParametersProxy(parameterNames, 'parameters')

      const args: AvailableVariables = {
        pipeline: {
          id: escape('pipeline.id'),
          number: escape('pipeline.number'),
          project: {
            gitUrl: escape('pipeline.project.git_url'),
            type: escape('pipeline.project.type'),
          },
          git: {
            tag: escape('pipeline.git.tag'),
            branch: escape('pipeline.git.branch'),
            revision: escape('pipeline.git.revision'),
            baseRevision: escape('pipeline.git.base_revision'),
          },
          parameters: pipelineParameters,
        },
        parameters,
      }

      return builder(args)
    }
  }
}
