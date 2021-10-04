import { EntryParameters } from '../../types/EntryParameters'
import { AddSSHKeysStep } from './built-in/AddSSHKeys'
import { AttachWorkspaceStep } from './built-in/AttachWorkspaceStep'
import { CheckoutStep } from './built-in/CheckoutStep'
import { CustomStep } from './built-in/CustomStep'
import { PersistToWorkspaceStep } from './built-in/PersistToWorkspaceStep'
import { RestoreCacheStep } from './built-in/RestoreCacheStep'
import { RunStep } from './built-in/RunStep'
import { SaveCacheStep } from './built-in/SaveCacheStep'
import { SetupRemoteDockerStep } from './built-in/SetupRemoteDockerStep'
import { StoreArtifactsStep } from './built-in/StoreArtifactsStep'
import { StoreTestResultsStep } from './built-in/StoreTestResultsStep'
import { WhenStep } from './built-in/WhenStep'

export class Steps {
  static addSSHKeys(...params: EntryParameters<typeof AddSSHKeysStep>) {
    return new AddSSHKeysStep(...params)
  }
  static attachWorkspace(
    ...params: EntryParameters<typeof AttachWorkspaceStep>
  ) {
    return new AttachWorkspaceStep(...params)
  }
  static checkout(...params: EntryParameters<typeof CheckoutStep>) {
    return new CheckoutStep(...params)
  }
  static custom(...params: EntryParameters<typeof CustomStep>) {
    return new CustomStep(...params)
  }
  static persistToWorkspace(
    ...params: EntryParameters<typeof PersistToWorkspaceStep>
  ) {
    return new PersistToWorkspaceStep(...params)
  }
  static restoreCache(...params: EntryParameters<typeof RestoreCacheStep>) {
    return new RestoreCacheStep(...params)
  }
  static run(...params: EntryParameters<typeof RunStep>) {
    return new RunStep(...params)
  }
  static saveCache(...params: EntryParameters<typeof SaveCacheStep>) {
    return new SaveCacheStep(...params)
  }
  static setupRemoteDocker(
    ...params: EntryParameters<typeof SetupRemoteDockerStep>
  ) {
    return new SetupRemoteDockerStep(...params)
  }
  static storeArtifacts(...params: EntryParameters<typeof StoreArtifactsStep>) {
    return new StoreArtifactsStep(...params)
  }
  static storeTestResults(
    ...params: EntryParameters<typeof StoreTestResultsStep>
  ) {
    return new StoreTestResultsStep(...params)
  }
  static when(...params: EntryParameters<typeof WhenStep>) {
    return new WhenStep(...params)
  }
}
