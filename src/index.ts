import { LogicStatement } from './models/LogicStatement'
import { Parameters } from './models/parameters/Parameters'
import { Pipeline } from './models/Pipeline'
import { Steps } from './models/steps/Steps'
import { variables } from './models/variables'
import { Filter } from './models/workflow/Filter'

const pipeline = new Pipeline()
pipeline.addOrb('hello', 'circleci/hello-build@0.0.5')

const dockerExecutor = pipeline.addExecutor('test-executor')
dockerExecutor.resourceClass = 'xxxlarge'
dockerExecutor.shell = 'xxxx'
dockerExecutor.workingDirectory = 'xx/jjj'
dockerExecutor.addWindows('win')

const testStep = Steps.run('echo hello')
testStep.name = 'yooo'
testStep.shell = 'aaaa'
testStep.background = true

testStep.when = 'on_success'

const checkoutStep = Steps.checkout()
checkoutStep.path = 'xxx'

const deepStuff = new LogicStatement()
const deep2Stuff = new LogicStatement()
const testing = new LogicStatement()
testing.matches = {
  pattern: 'xxxx',
  value: 'zzzzz',
}
deep2Stuff.or = [testing, 'xxxx', 'yyyy']
deepStuff.and = [deep2Stuff, true]

const whenStep = Steps.when(true)
const when2Step = Steps.when(deepStuff)
whenStep.addStep(when2Step)

const nestedStep = Steps.run('echo deep')
when2Step.addStep(nestedStep)

const dockerStep = Steps.setupRemoteDocker()
dockerStep.version = 'xxx'
dockerStep.dockerLayerCaching = true
when2Step.addStep(dockerStep)
const saveCacheStep = Steps.saveCache(['path-1', 'path-2'], 'my-cache-path')
saveCacheStep.name = 'XXX'
saveCacheStep.when = 'fail'
when2Step.addStep(saveCacheStep)

const restoreCacheStep = Steps.restoreCache()
restoreCacheStep.keys = [
  'xxx',
  variables`test ${({ parameters }) => parameters['test-ing']}`,
]
restoreCacheStep.key = 'xaaa'
restoreCacheStep.name = 'test'
when2Step.addStep(restoreCacheStep)

const storeArtefactsStep = Steps.storeArtifacts('./path/to/art')
storeArtefactsStep.destination = '/my/destination'
when2Step.addStep(storeArtefactsStep)

const storeTestResultsStep = Steps.storeTestResults('/path/to/tests')
when2Step.addStep(storeTestResultsStep)

const persistToWorkspaceStep = Steps.persistToWorkspace('.', ['/bla', '/hoho'])
when2Step.addStep(persistToWorkspaceStep)

const attachWorkspaceStep = Steps.attachWorkspace('./test')
when2Step.addStep(attachWorkspaceStep)

const addSSHKeysStep = Steps.addSSHKeys()
addSSHKeysStep.fingerprints = ['xxxx', 'yyy']
when2Step.addStep(addSSHKeysStep)

const enumParameter = Parameters.enum(['aaa', 'bbb', 'ccc'])
enumParameter.default = 'bbb'

const stringParameter = Parameters.string()
stringParameter.description = 'String parameter'

const intParameter = Parameters.integer()
intParameter.default = 2
intParameter.description = 'Tesssting'

pipeline.addParameter('test', Parameters.boolean())

const job = pipeline.addJob('bla-bla')
const docker = job.addDocker('blabla')
pipeline.addOrb('orb', 'aws-cli@2.0.3')
docker.user = 'root'
job
  .addParameter('test-ing', stringParameter)
  .addParameter('bla', intParameter)
  .addParameter('blaaaa', enumParameter)
  .addParameter('bool', Parameters.boolean())
  .addStep(checkoutStep)
  .addStep(
    Steps.run(variables`checkout ${({ pipeline }) => pipeline.project.gitUrl}`),
  )
  .addStep(testStep)
  .addStep(whenStep)
  .addStep(
    Steps.custom('blo', {
      'my-weird-variable': 'testing',
    }),
  )

const command = pipeline.addCommand('blo')
command.addParameter('my-weird-variable', Parameters.boolean())

job.circleciIpRanges = true
job.environment = {
  xxx: 'hohooho',
}

const workflow = pipeline.addWorkflow('my-workflow')
const filter = new Filter()
filter.only = ['xxx', 'xxx']
filter.ignore = ['hhh', 'aaa']
workflow.when = deep2Stuff
workflow.unless = 'bla bla'
workflow.addTrigger('* * * *', filter)

const jobConfig = workflow.addJob('my-job')
jobConfig.name = 'hello'
jobConfig.type = 'approval'
jobConfig.branchFilter = filter
jobConfig.tagFilter = filter
const matrix = jobConfig.addMatrix()
matrix.addParameter('version', ['0.1', '0.2', '0.3'])
matrix.addParameter('hejhej', ['11', '12'])
matrix.addExclude({
  version: '0.1',
  hejhej: '11',
})
matrix.addExclude({
  version: '0.1',
  hejhej: '11',
})
matrix.alias = 'tsetet'
const test = Steps.run(
  variables`checkout ${({ parameters }) =>
    `${parameters.version} ${parameters.hejhej}`}`,
)

test.environment = {
  MY_VAR: variables`bla`,
  MY_VAR2: variables`test ${({ parameters }) =>
    `${parameters.version} ${parameters.hejhej}`}`,
}
jobConfig
  .addPreStep(test)
  .addPreStep(checkoutStep)
  .addPostStep(checkoutStep)
  .addPostStep(checkoutStep)
jobConfig.addRequire('job-is-required').addContext('github')

console.log(pipeline.toConfigString())
