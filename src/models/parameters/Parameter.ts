import { Command } from '../Command'
import { ChildEntry } from '../Entity'
import { Job } from '../Job'
import { Pipeline } from '../Pipeline'

export abstract class Parameter extends ChildEntry<Job | Command | Pipeline> {
  protected type: string
  public description: string | null = null

  constructor(type: string) {
    super()
    this.type = type
  }
}
