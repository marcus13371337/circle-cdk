import { pickAttributesToConfig } from '../../utils/pickAttributesToConfig'
import { ChildEntry } from '../Entity'
import { Workflow } from './Workflow'

export class Filter extends ChildEntry<Workflow> {
  public only: string | string[] | null = null
  public ignore: string | string[] | null = null

  toConfig() {
    return pickAttributesToConfig(this, ['only', 'ignore'])
  }
}
