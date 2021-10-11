import { customizeObject, Customizer } from '../../utils/customizeObject'
import { BooleanParamter } from './simpleParameters/BooleanParameter'
import { EnumParameter } from './simpleParameters/EnumParameter'
import { IntegerParameter } from './simpleParameters/IntegerParameter'
import { StringParameter } from './simpleParameters/StringParameter'

export class Parameters {
  static boolean(customize?: Customizer<BooleanParamter>) {
    return customizeObject(new BooleanParamter(), customize)
  }
  static enum(values: string[], customize?: Customizer<EnumParameter>) {
    return customizeObject(new EnumParameter(values), customize)
  }
  static integer(customize?: Customizer<IntegerParameter>) {
    return customizeObject(new IntegerParameter(), customize)
  }
  static string(customize?: Customizer<StringParameter>) {
    return customizeObject(new StringParameter(), customize)
  }
}
