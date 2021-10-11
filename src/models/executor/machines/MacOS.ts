import { ChildEntry } from '../../Entity'
import { Executor } from '../Executor'

export class MacOS extends ChildEntry<Executor> {
  constructor(public xcode: string) {
    super()
  }

  toConfig() {
    return { xcode: this.xcode }
  }
}
