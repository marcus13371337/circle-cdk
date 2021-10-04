import { Config } from '../../../types/Config'
import { pickAttributesToConfig } from '../../../utils/pickAttributesToConfig'
import { ChildEntry } from '../../Entity'
import { Executor } from '../Executor'

interface Auth {
  username: string
  password: string
}

interface AwsAuth {
  awsAccessKeyId: string
  awsSecretAccessKey: string
}

export class Docker extends ChildEntry<Executor> {
  public image: string
  public name: string | null = null
  public entrypoint: string | string[] | null = null
  public command: string | string[] | null = null
  public user: string | null = null
  public environment: Record<string, string> = {}
  public auth: Auth | null = null
  public awsAuth: AwsAuth | null = null

  constructor(image: string) {
    super()
    this.image = image
  }

  toConfig() {
    const result: Config = pickAttributesToConfig(this, [
      'name',
      'entrypoint',
      'command',
      'user',
      'auth',
      'awsAuth',
    ])

    if (Object.keys(this.environment).length) {
      result.environment = this.environment
    }

    return Object.keys(result).length
      ? { image: this.image, ...result }
      : this.image
  }
}
