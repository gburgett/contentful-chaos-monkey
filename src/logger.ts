import chalk from 'chalk'

// tslint:disable:no-console

type LogFn = (msg: string, ...optionalParams: any[]) => any

export interface ILogger extends LogFn {
  debug: LogFn,
  info: LogFn,
  error: LogFn
}

const emptyLogFn = () => (msg: string, ...optionalParams: any[]) => {
  return
}

const debugLogFn = (msg: string, ...optionalParams: any[]) => {
  console.log(chalk.gray(msg), ...optionalParams)
}

const infoLogFn = (msg: string, ...optionalParams: any[]) => {
  console.log(msg, ...optionalParams)
}

const errorLogFn = (msg: string, ...optionalParams: any[]) => {
  console.log(chalk.red(msg), ...optionalParams)
}

export const DefaultLogger: ILogger = Object.assign(
  infoLogFn,
  {
    debug: emptyLogFn(),
    info: infoLogFn,
    error: errorLogFn,
  })

export const VerboseLogger: ILogger = Object.assign(
  infoLogFn,
  {
    debug: debugLogFn,
    info: infoLogFn,
    error: errorLogFn,
  },
)

export const QuietLogger: ILogger = Object.assign(
  emptyLogFn(),
  {
    debug: emptyLogFn(),
    info: emptyLogFn(),
    error: emptyLogFn(),
  },
)

export default DefaultLogger
