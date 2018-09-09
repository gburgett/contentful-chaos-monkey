import {createClient} from 'contentful-management'

import { ILogger } from './logger'

export interface IArgs {
  managementToken: string
  space: string,
  logger: ILogger
}

export default async function Run(args: IArgs): Promise<number | void> {
  args.logger.debug('Hello World!')
  const client = await createClient({
    accessToken: args.managementToken,
  })
  const space = await client.getSpace(args.space)
  const resp: IPreviewEnvironmentsResp = await client.rawRequest({
    method: 'GET',
    url: `/${args.space}/preview_environments?limit=100`,
  })

  resp.items.forEach((preview) => {
    args.logger.info('prev', preview.configurations)
  })
}

interface IPreviewEnvironmentsResp {
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
