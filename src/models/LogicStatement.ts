import { customizeObject, Customizer } from '../utils/customizeObject'
import { pickAttributesToConfig } from '../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from './Entity'
import { Step } from './steps/Step'
import { compileExpression, ExpressionOrValue } from './variables'
import { Workflow } from './workflow/Workflow'

interface Matcher {
  pattern: string
  value: string
}

export type BasicLogicStatement = ExpressionOrValue

export type Statement = LogicStatement | BasicLogicStatement

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

  addOr<T extends Statement>(statement: T, customize?: Customizer<T>) {
    this.or = [...this.or, customizeObject(statement, customize)]
    return this
  }

  addAnd<T extends Statement>(statement: T, customize?: Customizer<T>) {
    this.and = [...this.and, customizeObject(statement, customize)]
    return this
  }

  toConfig(context: ChildEntryConfigContext<Step | Workflow | LogicStatement>) {
    const config = pickAttributesToConfig(this, ['not', 'matches'], context)

    if (this.equal.length) {
      config.equal = this.equal.map((equal) => compileStatement(equal, context))
    }

    if (this.and.length) {
      config.and = this.and.map((statement) =>
        compileStatement(statement, context),
      )
    }

    if (this.or.length) {
      config.or = this.or.map((statement) =>
        compileStatement(statement, context),
      )
    }

    if (this.not) {
      config.not = compileStatement(this.not, context)
    }

    return config
  }
}

export const compileStatement = (
  statement: LogicStatement | BasicLogicStatement,
  context: ChildEntryConfigContext<Step | Workflow | LogicStatement>,
) => {
  if (isLogicStatement(statement)) {
    return statement.toConfig(context)
  }

  return compileExpression(statement, context)
}
