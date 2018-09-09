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

let logger = DefaultLogger
if (argv.verbose) {
  logger = VerboseLogger
}

Run({
  logger,
})
  .then((code) => {
    process.exit(code || 0)
  })
  .catch((err) => {
    logger.error(err)
  })
