import { Config } from '../../../types/Config'
import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntry, ChildEntryConfigContext } from '../../Entity'
import { Job } from '../../Job'
import { Executor } from '../Executor'

interface Auth {
  username: string
  password: string
}

interface AwsAuth {
  awsAccessKeyId: string
  awsSecretAccessKey: string
}

type Parent = Executor | Job

export class Docker extends ChildEntry<Parent> {
  public name: string | null = null
  public entrypoint: string | string[] | null = null
  public command: string | string[] | null = null
  public user: string | null = null
  public environment: Record<string, string> = {}
  public auth: Auth | null = null
  public awsAuth: AwsAuth | null = null

  constructor(public image: string) {
    super()
  }

  toConfig(context: ChildEntryConfigContext<Parent>) {
    const result: Config = pickAttributesToConfig(
      this,
      ['name', 'entrypoint', 'command', 'user', 'auth', 'awsAuth'],
      context,
    )

    if (Object.keys(this.environment).length) {
      result.environment = this.environment
    }

    return { image: this.image, ...result }
  }
}
