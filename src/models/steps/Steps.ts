import { customizeObject, Customizer } from '../../utils/customizeObject'
import { Statement } from '../LogicStatement'
import { ExpressionOrValue } from '../variables'
import { AddSSHKeysStep } from './built-in/AddSSHKeys'
import { AttachWorkspaceStep } from './built-in/AttachWorkspaceStep'
import { CheckoutStep } from './built-in/CheckoutStep'
import { CustomStep, CustomStepParams } from './built-in/CustomStep'
import { PersistToWorkspaceStep } from './built-in/PersistToWorkspaceStep'
import { RestoreCacheStep } from './built-in/RestoreCacheStep'
import { RunStep } from './built-in/RunStep'
import { SaveCacheStep } from './built-in/SaveCacheStep'
import { SetupRemoteDockerStep } from './built-in/SetupRemoteDockerStep'
import { StoreArtifactsStep } from './built-in/StoreArtifactsStep'
import { StoreTestResultsStep } from './built-in/StoreTestResultsStep'
import { WhenStep } from './built-in/WhenStep'

export class Steps {
  static addSSHKeys(customizer?: Customizer<AddSSHKeysStep>) {
    return customizeObject(new AddSSHKeysStep(), customizer)
  }
  static attachWorkspace(
    at: string,
    customizer?: Customizer<AttachWorkspaceStep>,
  ) {
    return customizeObject(new AttachWorkspaceStep(at), customizer)
  }
  static checkout(customizer?: Customizer<CheckoutStep>) {
    return customizeObject(new CheckoutStep(), customizer)
  }
  static custom(
    type: string,
    params?: CustomStepParams,
    customizer?: Customizer<CustomStep>,
  ) {
    return customizeObject(new CustomStep(type, params), customizer)
  }
  static persistToWorkspace(
    root: ExpressionOrValue<string>,
    paths: ExpressionOrValue<string>[],
    customizer?: Customizer<PersistToWorkspaceStep>,
  ) {
    return customizeObject(new PersistToWorkspaceStep(root, paths), customizer)
  }
  static restoreCache(customizer?: Customizer<RestoreCacheStep>) {
    return customizeObject(new RestoreCacheStep(), customizer)
  }
  static run(
    command: ExpressionOrValue<string>,
    customizer?: Customizer<RunStep>,
  ) {
    return customizeObject(new RunStep(command), customizer)
  }
  static saveCache(
    paths: ExpressionOrValue<string>[],
    key: ExpressionOrValue<string>,
    customizer?: Customizer<SaveCacheStep>,
  ) {
    return customizeObject(new SaveCacheStep(paths, key), customizer)
  }
  static setupRemoteDocker(customizer?: Customizer<SetupRemoteDockerStep>) {
    return customizeObject(new SetupRemoteDockerStep(), customizer)
  }
  static storeArtifacts(
    path: ExpressionOrValue<string>,
    customizer?: Customizer<StoreArtifactsStep>,
  ) {
    return customizeObject(new StoreArtifactsStep(path), customizer)
  }
  static storeTestResults(
    path: ExpressionOrValue<string>,
    customizer?: Customizer<StoreTestResultsStep>,
  ) {
    return customizeObject(new StoreTestResultsStep(path), customizer)
  }
  static when(condition: Statement, customizer?: Customizer<WhenStep>) {
    return customizeObject(new WhenStep(condition), customizer)
  }
}
