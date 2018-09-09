export interface IArgs {
  logger: (msg: string) => any
}

export default async function Run(args: IArgs) {
  args.logger('Hello World!')
}
