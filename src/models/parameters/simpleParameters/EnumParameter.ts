import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { SimpleParameter } from './SimpleParameter'

export class EnumParameter extends SimpleParameter {
  public default: string | null = null
  public enum: string[] = []

  constructor(enumValues: string[]) {
    super('enum')
    this.enum = enumValues
  }

  assertValid() {
    if (this.default && !this.enum.includes(this.default)) {
      throw new Error('Default value not part of enum values')
    }
  }

  toConfig() {
    this.assertValid()

    const result = pickAttributesToConfig(this, [
      'description',
      'default',
      'enum',
    ])

    return Object.keys(result).length > 0
      ? { type: this.type, ...result }
      : this.type
  }
}
