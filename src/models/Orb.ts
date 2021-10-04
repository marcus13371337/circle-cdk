import { ChildEntry } from './Entity'
import { Pipeline } from './Pipeline'

export class Orb extends ChildEntry<Pipeline> {
  public name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  toConfig() {
    return this.name
  }
}
