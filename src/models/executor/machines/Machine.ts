import { ChildEntry } from '../../Entity'
import { Executor } from '../Executor'

export class Machine extends ChildEntry<Executor> {
  public dockerLayerCaching = false

  constructor(public image: string) {
    super()
  }

  toConfig() {
    return this.dockerLayerCaching
      ? {
          image: this.image,
          dockerLayerCaching: this.dockerLayerCaching,
        }
      : this.image
  }
}
