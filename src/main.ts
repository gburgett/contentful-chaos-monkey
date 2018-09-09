import {createClient} from 'contentful-management'

import { ILogger } from './logger'

export interface IArgs {
  accessToken: string
  logger: ILogger
}

export default async function Run(args: IArgs): Promise<number | void> {
  args.logger.debug('Hello World!')
  const client = await createClient({
    accessToken: args.accessToken,
  })
}
