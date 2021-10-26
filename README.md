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
const pipeline = Pipeline.create((pipeline) => {
  pipeline.addWorkflow('my-workflow', (workflow) => {
    workflow.addJobConfig('hello-world')
  })

  pipeline.addJob('hello-world', (job) => {
    job.addDocker('cimg/node:14.17')
    job.addStep(Steps.run(`echo "Hello World"`))
  })
})
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
      - run: echo "Hello World"
```

### Add configuration
```ts
const pipeline = Pipeline.create((pipeline) => {
  pipeline.addWorkflow('my-workflow', (workflow) => {
    workflow.addJobConfig('hello-world', (jobConfig) => {
      jobConfig.contexts = ['my-context']
    })
  })

  pipeline.addJob('hello-world', (job) => {
    job.addDocker('cimg/node:14.17')

    job.addStep(
      Steps.run(`echo "Hello World"`, (step) => {
        step.workingDirectory = '/my-project'
      }),
    )
  })
})
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
      - run:
          command: echo "Hello World"
          working_directory: /my-project
```

### Using variables
```ts
const pipeline = Pipeline.create((pipeline) => {
  pipeline.addWorkflow('my-workflow', (workflow) => {
    workflow.addJobConfig('hello-world')
  })

  pipeline.addJob('hello-world', (job) => {
    job.addDocker('cimg/node:14.17')

    job.addStep(
      Steps.custom('my-command', {
        name: 'Joe',
      }),
    )
  })

  pipeline.addCommand('my-command', (command) => {
    command.addParameter('name', Parameters.string())
    command.addStep(
      Steps.run(
        variables`echo "hello ${({ parameters }) =>
          parameters.name} in pipeline ${({ pipeline }) => pipeline.id}"`,
      ),
    )
  })
})
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
      - run: echo "hello << parameters.name >> in pipeline << pipeline.id >>"
    parameters:
      name: string
```
