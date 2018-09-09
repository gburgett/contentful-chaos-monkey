import { ILogger } from './logger'

export interface IArgs {
  logger: ILogger
}

export default async function Run(args: IArgs): Promise<number | void> {
  args.logger.debug('Hello World!')
}
