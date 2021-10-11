import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntryConfigContext } from '../../Entity'
import { Parameter, ParameterParent } from '../Parameter'

export class EnumParameter extends Parameter<string> {
  public enum: string[] = []

  constructor(public enumValues: string[]) {
    super('enum')
    this.enum = enumValues
  }

  assertValid() {
    if (this.default && !this.enum.includes(this.default)) {
      throw new Error('Default value not part of enum values')
    }
  }

  toConfig(context: ChildEntryConfigContext<ParameterParent>) {
    this.assertValid()

    const result = pickAttributesToConfig(
      this,
      ['description', 'default', 'enum'],
      context,
    )

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
