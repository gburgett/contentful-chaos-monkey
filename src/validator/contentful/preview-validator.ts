import { IEntry, IManagementClient } from 'contentful-management'
import * as _ from 'lodash'
import * as requestLib from 'request'
import { Response } from 'request'
import { ILogger, QuietLogger } from '../../logger'
import { AsyncRequest } from '../../utils/async-request'
import SequentialAsyncList from '../../utils/sequential-async-list'
import { IExpectation, IValidator } from '../types'

interface IOptions {
  client: IManagementClient
  space: string

  logger?: ILogger
}

const fieldsRegexp = /\{entry\.fields\.([^\}]+)\}/

type PreviewUrlGenerator = (entry: IEntry<any>) => string

const request = AsyncRequest(requestLib)

export default class PreviewValidator implements IValidator {
  private readonly client: IManagementClient
  private readonly space: string
  private readonly logger: ILogger

  private readonly previewMap: { [ct: string]: PreviewUrlGenerator[] } = {}

  constructor({ client, space, logger }: IOptions) {
    this.client = client
    this.space = space
    this.logger = logger || QuietLogger

    this.getPreviewUrls = this.getPreviewUrls.bind(this)
  }

  public async buildExpectations(entry: IEntry<any>): Promise<IExpectation[]> {
    const generators = await this.getPreviewUrls(entry.sys.contentType.sys.id)

    return SequentialAsyncList.lift(generators)
      .flatMap(async (g) => {
        const url = g(entry)
        this.logger.debug(`GET ${url}`)
        const resp = await request.get(url)
        if (resp.statusCode >= 500) {
          this.logger.error(`${resp.statusCode} when inspecting`, url)
        }

        return new PreviewExpectation(url, entry, resp)
      })
  }

  private async getPreviewUrls(contentType: string) {
    if (this.previewMap[contentType]) {
      return this.previewMap[contentType]
    }

    this.logger.debug(`GET /${this.space}/preview_environments?limit=100`)
    const resp: IPreviewEnvironmentsResp = await this.client.rawRequest({
      method: 'GET',
      url: `/${this.space}/preview_environments?limit=100`,
    })

    if (resp.items.length <= 0) {
      this.logger.error(`No previews configured in space`, this.space)
      return []
    }

    const previews = _.flatMap(resp.items, (v) =>
      v.configurations.filter((c) => (
        c.enabled && c.contentType == contentType && c.url && c.url.length > 0
      )),
    )

    if (previews.length <= 0) {
      this.logger.info(`No active preview configurations found for content type`, contentType)
    }

    const generators = previews.map((p) => (entry: IEntry<any>) => (
      p.url.replace(fieldsRegexp, (substr, field) => (
        entry.fields[field] && entry.fields[field]['en-US']
      ))
    ))
    return (this.previewMap[contentType] = generators)
  }

}

export class PreviewExpectation implements IExpectation {
  public statusCode: number

  constructor(
    public readonly url: string,
    public readonly entry: IEntry<any>,
    private readonly resp: Response,
  ) {
    this.statusCode = resp.statusCode
  }

  public async validate() {
    const resp = await request.get(this.url)
    if (resp.statusCode == this.statusCode) {
      return { ok: true }
    }

    return {
      ok: false,
      error: new Error(`Status code changed: expected ${this.statusCode}, got ${resp.statusCode}`),
    }
  }
}

export interface IPreviewEnvironmentsResp {
  limit: number,
  skip: number,
  total: number,
  items: IPreviewEnvironment[]
}

interface IPreviewEnvironment {
  name: string,
  description: string,
  sys: {
    type: 'PreviewEnvironment',
    id: string,
    version: number,
    space: any,
    createdAt: string,
    updatedAt: string,
  },
  configurations: IPreviewconfiguration[]
}

interface IPreviewconfiguration {
  /** 'http://www.theporch.live{entry.fields.slug}?preview=topsecretpassword' */
  url: string,
  contentType: string,
  enabled: true,
  example: false
}
