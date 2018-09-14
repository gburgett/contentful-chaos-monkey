import {createClient} from 'contentful-management'

import DefaultLogger, { ILogger } from './logger'
import ContentfulValidator from './validator/contentful/contentful'

export interface IArgs {
  managementToken: string
  space: string,
  logger: ILogger,
  targets: string[]
}

export default async function Run(args: IArgs): Promise<number | void> {
  const client = await createClient({
    accessToken: args.managementToken,
  })

  const services = {
    client,
    logger: args.logger || DefaultLogger,
  }

  const validator = new ContentfulValidator(Object.assign({}, args, services))

  const map = await validator.inspect(args.targets)
  for (const key of Object.keys(map)) {
    const result = await map[key]
    services.logger.info(`${key}:`, result)
  }
}
