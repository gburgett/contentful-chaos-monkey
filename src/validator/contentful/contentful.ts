import { IManagementClient, Space } from 'contentful-management'
import { AsyncMap } from '../../utils'
import SequentialAsyncList from '../../utils/sequential-async-list'
import { IExpectation, IExpectationMap, IValidator } from '../types'
import PreviewValidator from './preview-validator'

interface IOptions {
  space: string
  client: IManagementClient
  validators?: IValidator[]
}

const VALIDATORS = [
  PreviewValidator,
]

export default class ContentfulValidator {
  private validators: IValidator[]
  private space: Space

  constructor(private readonly options: IOptions) {
    this.validators = options.validators || VALIDATORS.map((v) => new v(options))

    this.inspect = this.inspect.bind(this)
    this.getSpace = this.getSpace.bind(this)
  }

  public async inspect(ids: string[]): Promise<AsyncMap<IExpectationMap>> {
    const space = await this.getSpace()

    return ids.reduce((map, id) => {
      map[id] = this._runValidators(space, id)
      return map
    }, {} as AsyncMap<IExpectationMap>)
  }

  private async getSpace() {
    return this.space ||
      (this.space = await this.options.client.getSpace(this.options.space))
  }

  private async _runValidators(space: Space, id: string) {
    const entry = await space.getEntry(id)

    return SequentialAsyncList.lift(this.validators)
        .flatMap((v) => v.buildExpectations(entry))
        .all()
  }
}
