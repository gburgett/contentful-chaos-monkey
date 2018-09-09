import * as yargs from 'yargs'

import {DefaultLogger, VerboseLogger} from './logger'
import Run from './main'

const argv = yargs
  .usage('$0 --from <export file or space> --to <export file or space>')
  .option('verbose', {
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

Run(Object.assign(defaultArgs, argv))
  .then((code) => {
    process.exit(code || 0)
  })
  .catch((err) => {
    defaultArgs.logger.error(err)
    process.exit(-1)
  })
