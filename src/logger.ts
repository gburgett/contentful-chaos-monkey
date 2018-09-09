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
  if (optionalParams.length > 0) {
    console.log(chalk.gray(msg), optionalParams)
  } else {
    console.log(chalk.gray(msg))
  }
}

const infoLogFn = (msg: string, ...optionalParams: any[]) => {
  if (optionalParams.length > 0) {
    console.log(msg, optionalParams)
  } else {
    console.log(msg)
  }
}

const errorLogFn = (msg: string, ...optionalParams: any[]) => {
  if (optionalParams.length > 0) {
    console.log(chalk.red(msg), optionalParams)
  } else {
    console.log(chalk.red(msg))
  }
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
