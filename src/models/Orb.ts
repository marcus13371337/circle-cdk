import { ChildEntry } from './Entity'
import { Pipeline } from './Pipeline'

export class Orb extends ChildEntry<Pipeline> {
  constructor(public nameAndVersion: string) {
    super()
  }

  toConfig() {
    return this.nameAndVersion
  }
}
