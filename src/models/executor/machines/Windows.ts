import { ChildEntry } from '../../Entity'
import { Executor } from '../Executor'

export class Windows extends ChildEntry<Executor> {
  public name = 'win/default'

  toConfig() {
    return this.name
  }
}
