import { expect } from 'chai'
import { IEntry } from 'contentful-management'
import * as sinon from 'sinon'
import { fakeEntry } from '../../utils/fake-contentful'
import ContentfulValidator from './contentful'

describe('validator/contentful', () => {
  describe('ContentfulValidator', () => {
    describe('inspect', () => {
      it('gets validators for the entry', async () => {
        const entry = fakeEntry({})
        const client = fakeClient(entry)

        const fakeValidator = {
          buildExpectations: sinon.stub().withArgs(entry).returns(['test']),
        }

        const subject = new ContentfulValidator({
          space: 'test',
          client: client as any,
          validators: [fakeValidator],
        })

        // act
        const result = await subject.inspect([entry.sys.id])
        const validators = await result[entry.sys.id]

        // assert
        expect(validators[0]).to.eq('test')
      })
    })
  })
})

function fakeClient(entry?: IEntry<any>) {
  const environment = {
    getEntry: sinon.stub().callsFake(((id) => {
      if (entry && id == entry.sys.id) {
        return Promise.resolve(entry)
      }
      return Promise.resolve()
    })),
  }

  const space = {
    getEnvironment: sinon.stub().returns(Promise.resolve(environment)),
  }

  return {
    getSpace: sinon.stub().returns(Promise.resolve(space)),
  }
}
