import { pickAttributesToConfig } from '../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from './Entity'
import { Step } from './steps/Step'
import { Compiler, isCompiler } from './Variables'
import { Workflow } from './workflow/Workflow'

interface Matcher {
  pattern: string
  value: string
}

export type BasicLogicStatement = string | number | boolean | Compiler

type Statement = LogicStatement | BasicLogicStatement

export const isLogicStatement = (
  statement: Statement,
): statement is LogicStatement => statement instanceof LogicStatement

export class LogicStatement extends ChildEntry<
  Step | Workflow | LogicStatement
> {
  public and: Array<Statement> = []
  public or: Array<Statement> = []
  public not: Statement | null = null
  public equal: BasicLogicStatement[] = []
  public matches: Matcher | null = null

  addEqual(value: BasicLogicStatement) {
    this.equal.push(value)
  }

  addOr(statement: Statement) {
    this.or = [...this.or, statement]
    return this
  }

  addAnd(statement: Statement) {
    this.and = [...this.and, statement]
    return this
  }

  toConfig(context: ChildEntryConfigContext<Step | Workflow | LogicStatement>) {
    const config = pickAttributesToConfig(this, ['not', 'matches'])

    if (this.equal.length) {
      config.equal = this.equal.map((equal) => compile(equal, context))
    }

    if (this.and.length) {
      config.and = this.and.map((statement) => compile(statement, context))
    }

    if (this.or.length) {
      config.or = this.or.map((statement) => compile(statement, context))
    }

    if (this.not) {
      config.not = compile(this.not, context)
    }

    return config
  }
}

export const compile = (
  statement: LogicStatement | BasicLogicStatement,
  context: ChildEntryConfigContext<Step | Workflow | LogicStatement>,
) => {
  if (isLogicStatement(statement)) {
    return statement.toConfig(context)
  }

  if (isCompiler(statement)) {
    return statement({
      pipelineParameterNames: context.pipeline.getParameterNames(),
      parameterNames: context.availableParameters,
    })
  }

  return statement
}
