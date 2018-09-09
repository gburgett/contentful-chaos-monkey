import * as yargs from 'yargs'

import {DefaultLogger, VerboseLogger} from './logger'
import Run from './main'

const argv = yargs
  .usage('$0 --from <export file or space> --to <export file or space>')
  .option('verbose', {
    alias: 'v',
    description: 'Print log output to stderr',
  })
  .argv

const defaultArgs = {
  logger: DefaultLogger,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
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
