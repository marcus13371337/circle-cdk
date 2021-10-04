import { ChildEntry } from '../../Entity'
import { Executor } from '../Executor'

export class MacOS extends ChildEntry<Executor> {
  public xcode: string

  constructor(xcode: string) {
    super()
    this.xcode = xcode
  }

  toConfig() {
    return { xcode: this.xcode }
  }
}
