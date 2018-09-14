
import { expect } from 'chai'
import * as nock from 'nock'
import * as sinon from 'sinon'

import { wait } from '../utils'
import {fakeEntry} from '../utils/fake-contentful'

import PreviewValidator, { IPreviewEnvironmentsResp, PreviewExpectation } from './preview-validator'

// tslint:disable:no-unused-expression

describe('PreviewValidator', () => {
  describe('buildExpectations', () => {
    context('no preview URLs', () => {
      it('generates no expectations', async () => {
        const client = {
          rawRequest: sinon.stub().returns(Promise.resolve({
            items: [],
          })),
        }

        const subject = new PreviewValidator({ client: client as any, space: 'testspace' })

        // act
        const expectations = await subject.buildExpectations(fakeEntry({}))

        expect(expectations).to.be.empty
      })
    })

    context('preview URL given', () => {
      it('calls out to preview URL for given entry', async () => {
        const client = {
          rawRequest: sinon.stub().returns(Promise.resolve({
            items: [{
              configurations: [
                {
                  contentType: 'fake',
                  enabled: true,
                  url: 'https://fake.preview/{entry.fields.slug}?preview=test',
                },
              ],
            }],
          } as IPreviewEnvironmentsResp)),
        }

        const stub = nock('https://fake.preview')
          .get('/some-slug?preview=test')
          .reply(201)

        const subject = new PreviewValidator({ client: client as any, space: 'testspace' })

        // act
        const expectations = await subject.buildExpectations(fakeEntry({ slug: 'some-slug' }))

        expect(expectations).to.have.length(1)
        const exp = expectations[0] as PreviewExpectation
        expect(exp.statusCode).to.eq(201)
        expect(exp.url).to.eq('https://fake.preview/some-slug?preview=test')

        expect(stub.isDone()).to.be.true
      })

      it('resulting expectation can be revalidated', async () => {
        const client = {
          rawRequest: sinon.stub().returns(Promise.resolve({
            items: [{
              configurations: [
                {
                  contentType: 'fake',
                  enabled: true,
                  url: 'https://fake.preview/{entry.fields.slug}?preview=test',
                },
              ],
            }],
          } as IPreviewEnvironmentsResp)),
        }

        nock('https://fake.preview')
          .get('/some-slug?preview=test')
          .reply(201)
        const stub = nock('https://fake.preview')
          .get('/some-slug?preview=test')
          .reply(201)

        const subject = new PreviewValidator({ client: client as any, space: 'testspace' })
        const expectations = await subject.buildExpectations(fakeEntry({ slug: 'some-slug' }))

        // act
        const exp = expectations[0] as PreviewExpectation
        const validationResult = await exp.validate()

        expect(validationResult.ok).to.be.true

        expect(stub.isDone()).to.be.true
      })

      it('resulting expectation is error state if reply status changes', async () => {
        const client = {
          rawRequest: sinon.stub().returns(Promise.resolve({
            items: [{
              configurations: [
                {
                  contentType: 'fake',
                  enabled: true,
                  url: 'https://fake.preview/{entry.fields.slug}?preview=test',
                },
              ],
            }],
          } as IPreviewEnvironmentsResp)),
        }

        nock('https://fake.preview')
          .get('/some-slug?preview=test')
          .reply(201)
        nock('https://fake.preview')
          .get('/some-slug?preview=test')
          .reply(500)

        const subject = new PreviewValidator({ client: client as any, space: 'testspace' })
        const expectations = await subject.buildExpectations(fakeEntry({ slug: 'some-slug' }))

        // act
        const exp = expectations[0] as PreviewExpectation
        const validationResult = await exp.validate()

        expect(validationResult.ok).to.be.false
        expect(validationResult.error).to.exist
      })
    })

    context('multiple preview URLs given', () => {
      it('generates expectations only for active URLs matching content type', async () => {
        const client = {
          rawRequest: sinon.stub().returns(Promise.resolve({
            items: [{
              configurations: [
                {
                  contentType: 'fake',
                  enabled: true,
                  url: 'https://fake.preview/{entry.fields.slug}?preview=test',
                },
                {
                  contentType: 'fake',
                  enabled: false,
                  url: 'https://fake.preview.never/{entry.fields.slug}',
                },
              ],
            },
            {
              configurations: [
                {
                  contentType: 'other',
                  enabled: true,
                  url: 'https://fake.preview.never/{entry.fields.slug}',
                },
                {
                  contentType: 'fake',
                  enabled: true,
                  url: 'https://fake.preview/test?title={entry.fields.title}',
                },
              ],
            }],
          } as IPreviewEnvironmentsResp)),
        }

        nock('https://fake.preview').get('/some-slug?preview=test').reply(201)
        nock('https://fake.preview').get('/test?title=SomeTitle').reply(202)

        const subject = new PreviewValidator({ client: client as any, space: 'testspace' })

        // act
        const expectations = await subject.buildExpectations(
          fakeEntry({ slug: 'some-slug', title: 'SomeTitle' }),
        )

        expect(expectations).to.have.length(2)
        const exp = expectations[0] as PreviewExpectation
        expect(exp.statusCode).to.eq(201)
        expect(exp.url).to.eq('https://fake.preview/some-slug?preview=test')

        const exp2 = expectations[1] as PreviewExpectation
        expect(exp2.statusCode).to.eq(202)
        expect(exp2.url).to.eq('https://fake.preview/test?title=SomeTitle')

      })
    })
  })
})
