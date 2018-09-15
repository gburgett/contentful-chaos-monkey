import { Environment, IManagementClient, Space } from 'contentful-management'
import { ILogger, QuietLogger } from '../../logger'
import { AsyncMap } from '../../utils'
import SequentialAsyncList from '../../utils/sequential-async-list'
import { IExpectation, IExpectationMap, IValidator } from '../types'
import PreviewValidator from './preview-validator'

interface IOptions {
  space: string
  client: IManagementClient
  validators?: IValidator[]
  logger?: ILogger
}

const VALIDATORS = [
  PreviewValidator,
]

export default class ContentfulValidator {
  private validators: IValidator[]
  private space: Space
  private logger: ILogger

  constructor(private readonly options: IOptions) {
    this.validators = options.validators || VALIDATORS.map((v) => new v(options))
    this.logger = options.logger || QuietLogger

    this.inspect = this.inspect.bind(this)
    this.getSpace = this.getSpace.bind(this)
  }

  public async inspect(ids: string[]): Promise<AsyncMap<IExpectationMap>> {
    const space = await this.getSpace()
    const env = await space.getEnvironment('master')

    return ids.reduce((map, id) => {
      map[id] = this._runValidators(env, id)
      return map
    }, {} as AsyncMap<IExpectationMap>)
  }

  private async getSpace() {
    return this.space ||
      (this.space = await this.options.client.getSpace(this.options.space))
  }

  private async _runValidators(env: { getEntry: Environment['getEntry'] }, id: string) {
    this.logger.debug(`getEntry`, id)
    const entry = await env.getEntry(id)
    if (!entry) {
      this.logger.error(`Entry not found:`, id)
      return []
    }

    this.logger.debug(`validators`, this.validators)
    return SequentialAsyncList.lift(this.validators)
        .flatMap((v) => v.buildExpectations(entry))
  }
}
