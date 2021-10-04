import { Command } from '../Command'
import { ChildEntry, ChildEntryConfigContext } from '../Entity'
import { Job } from '../Job'
import { JobConfig } from '../workflow/JobConfig'

export type StepParent = Job | JobConfig | Command | Step

export abstract class Step<
  T extends string = string,
> extends ChildEntry<StepParent> {
  public readonly type: T
  constructor(type: T) {
    super()
    this.type = type
  }
}

export type StepConfigParams = ChildEntryConfigContext<StepParent>
