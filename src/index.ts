import * as yargs from 'yargs'

import {DefaultLogger, VerboseLogger} from './logger'
import Run from './main'

const argv = yargs
  .usage('$0 <id>')
  .option('verbose', {
    boolean: true,
    alias: 'v',
    description: 'Print log output to stderr',
  })
  .option('space', {
    alias: 's',
    description: 'The space to work in',
  })
  .option('token', {
    alias: 'a',
    description: 'A Contentful management token to download content from a space',
  })
  .argv

const defaultArgs = {
  logger: DefaultLogger,
  managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID,
}

if (argv.verbose) {
  defaultArgs.logger = VerboseLogger
}

const finalArgs = Object.assign(defaultArgs, argv, { targets: argv._ })

Run(finalArgs)
  .then((code) => {
    process.exit(code || 0)
  })
  .catch((err) => {
    defaultArgs.logger.error(err)
    process.exit(-1)
  })
