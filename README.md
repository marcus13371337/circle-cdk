# circleci-cdk
Config Development Kit for CircleCI. Write your pipelines in TypeScript instead of struggling with the documentation and YAML.

## Installation
**npm**
```bash
npm install circleci-cdk --save-dev
```

**yarn**
```bash
yarn add circleci-cdk -D
```

## Examples
### Hello world pipeline
```ts
const pipeline = new Pipeline()
const workflow = pipeline.addWorkflow('my-workflow')
workflow.addJobConfig('hello-world')

const job = pipeline.addJob('hello-world')
job.addDocker('cimg/node:14.17')
job.addStep(Steps.run(`echo "Hello World"`))
console.log(pipeline.toConfigString())
```
The code above will print:
```yaml
version: 2.1
workflows:
  my-workflow:
    jobs:
      - hello-world
jobs:
  hello-world:
    docker:
      - cimg/node:14.17
    steps:
      - echo "Hello World"
```

### Add configuration
```ts
const pipeline = new Pipeline()
const workflow = pipeline.addWorkflow('my-workflow')
const jobConfig = workflow.addJobConfig('hello-world')
jobConfig.contexts = ['my-context']

const job = pipeline.addJob('hello-world')
job.addDocker('cimg/node:14.17')

const echoStep = Steps.run(`echo "Hello World"`)
echoStep.workingDirectory = '/my-project'
job.addStep(echoStep)
console.log(pipeline.toConfigString())
```
will generate
```yaml
version: 2.1
workflows:
  my-workflow:
    jobs:
      - hello-world:
          context:
            - my-context
jobs:
  hello-world:
    docker:
      - cimg/node:14.17
    steps:
      - command: echo "Hello World"
        working_directory: /my-project
```

### Using variables
```ts
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
```
will generate
```yaml
version: 2.1
workflows:
  my-workflow:
    jobs:
      - hello-world
jobs:
  hello-world:
    docker:
      - cimg/node:14.17
    steps:
      - my-command:
          name: Joe
commands:
  my-command:
    steps:
      - echo "hello << parameters.name >> in pipeline << pipeline.id >>"
    parameters:
      name: string
```
