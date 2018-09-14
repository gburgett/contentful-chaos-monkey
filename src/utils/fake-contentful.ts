import { IAsset, IEntry, ILink, ISys } from 'contentful-management'

export function fakeSys<T extends string>(type: T, id: string = null): ISys<T> {
  return {
    space: fakeLink('Space'),
    id: id || fakeId(),
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revision: 1,
    environment: fakeLink('Environment'),
 }
}

export function fakeLink<T extends string>(type: T, id: string = null): ILink<T> {
  return {
    sys: {
      type: 'Link',
      linkType: type,
      id: id || fakeId(type + ':'),
    },
  }
}

export function fakeId(prefix: string = ''): string {
  return prefix + Math.random().toString(36).substr(2, 5)
}

export function fakeEntry<TEntry extends IEntry<TFields>, TFields>(
      // using TEntry['fields'] here makes this a strong type check.
      // Partial here so we can specify only the fields that matter for this spec.
    fields: Partial<TEntry['fields']>,
    contentType: string = null,
    id: string = null): IEntry<TFields> {

  const sys = Object.assign(fakeSys('Entry', id), {
    contentType: fakeLink('ContentType', contentType || 'fake'),
  })
  return {
    sys,
    fields: fields as TEntry['fields'],
  }
}

export function fakeAsset(url: string): IAsset {
  return {
    sys: fakeSys('Asset'),
    fields: {
      title: url,
      description: null,
      file: {
        url,
        fileName: url,
        contentType: 'text/pdf',
      },
    },
  }
}
