import { Parameter } from '../Parameter'

export class IntegerParameter extends Parameter<number> {
  constructor() {
    super('integer')
  }
}
