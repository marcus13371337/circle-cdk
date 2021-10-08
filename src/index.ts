import { Pipeline } from './models/Pipeline'
import { Steps } from './models/steps'
import { variables } from './models/variables'
import { Parameters } from './models/parameters/Parameters'

export { variables } from './models/variables'
export { Pipeline } from './models/Pipeline'
export { Orb } from './models/Orb'
export { LogicStatement } from './models/LogicStatement'
export { Job } from './models/Job'
export { Command } from './models/Command'
export * from './models/steps'
export * from './models/workflow'
export * from './models/parameters'
export * from './models/executor'

const pipeline = new Pipeline()
const workflow = pipeline.addWorkflow('my-workflow')
workflow.addJobConfig('hello-world')

const job = pipeline.addJob('hello-world')
job.addDocker('cimg/node:14.17')

const myCommand = pipeline.addCommand('my-command')
myCommand.addParameter('name', Parameters.string())
myCommand.addStep(
  Steps.run(
    variables`echo "hello ${({ parameters }) =>
      parameters.name} in pipeline ${({ pipeline }) => pipeline.id}"`,
  ),
)

job.addStep(
  Steps.custom('my-command', {
    name: 'Joe',
  }),
)
console.log(pipeline.toConfigString())
