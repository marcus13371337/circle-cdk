import { ChildEntry } from '../../Entity'
import { Executor } from '../Executor'

export class Machine extends ChildEntry<Executor> {
  public image: string
  public dockerLayerCaching = false

  constructor(image: string) {
    super()
    this.image = image
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
