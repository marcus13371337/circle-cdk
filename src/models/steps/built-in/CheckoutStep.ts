import { Step } from '../Step'

export class CheckoutStep extends Step<'checkout'> {
  public path: string | null = null

  constructor() {
    super('checkout')
  }

  toConfig() {
    return this.path
      ? {
          [this.type]: {
            path: this.path,
          },
        }
      : this.type
  }
}
