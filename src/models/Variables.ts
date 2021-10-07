import { ChildEntryConfigContext } from './Entity'

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

export type Expression = (params: {
  pipelineParameterNames: string[]
  parameterNames: string[]
}) => string

export type ExpressionOrValue<T = string | number | boolean> = Expression | T

const isExpression = (
  expression: ExpressionOrValue,
): expression is Expression => typeof expression === 'function'

export const compileExpression = <T>(
  expression: ExpressionOrValue,
  context: ChildEntryConfigContext<T>,
) =>
  isExpression(expression)
    ? expression({
        pipelineParameterNames: context.pipeline.getParameterNames(),
        parameterNames: context.availableParameters,
      })
    : expression

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

type StringBuilder = (args: AvailableVariables) => string

export const variables = (
  strings: TemplateStringsArray,
  ...builders: StringBuilder[]
): Expression => {
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

    const result: string[] = []

    strings.forEach((string, index) => {
      result.push(string)
      if (builders.length > index) {
        result.push(builders[index](args))
      }
    })

    return result.join('')
  }
}
