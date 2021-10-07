import { ChildEntry } from './Entity'
import { Pipeline } from './Pipeline'

export class Orb extends ChildEntry<Pipeline> {
  public nameAndVersion: string

  constructor(nameAndVersion: string) {
    super()
    this.nameAndVersion = nameAndVersion
  }

  toConfig() {
    return this.nameAndVersion
  }
}
