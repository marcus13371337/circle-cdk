import { EntryParameters } from '../../types/EntryParameters'
import { BooleanParamter } from './simpleParameters/BooleanParameter'
import { EnumParameter } from './simpleParameters/EnumParameter'
import { IntegerParameter } from './simpleParameters/IntegerParameter'
import { StringParameter } from './simpleParameters/StringParameter'

export class Parameters {
  static boolean(...params: EntryParameters<typeof BooleanParamter>) {
    return new BooleanParamter(...params)
  }
  static enum(...params: EntryParameters<typeof EnumParameter>) {
    return new EnumParameter(...params)
  }
  static integer(...params: EntryParameters<typeof IntegerParameter>) {
    return new IntegerParameter(...params)
  }
  static string(...params: EntryParameters<typeof StringParameter>) {
    return new StringParameter(...params)
  }
}
