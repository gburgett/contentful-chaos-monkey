
import { expect } from 'chai'
import {wait} from '../utils'
import SequentialAsyncList from './sequential-async-list'

describe('SequentialAsyncList', () => {

  describe('flatMap', () => {
    it('returns a SequentialAsyncList', () => {
      const subject = SequentialAsyncList.lift([1])

      const result = subject.flatMap(async (x) => x + 1)

      expect(result).to.be.instanceof(SequentialAsyncList)
    })

    it('executes each promise in sequence', async () => {
      const sequence = [] as number[]
      const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const subject = SequentialAsyncList.lift(values)

      const before = Date.now()
      const result = subject.flatMap(async (x) => {
        await wait(10 - x)
        sequence.push(x)
        return x * 10
      }).flatMap(async (x2) => {
        await wait(100 - x2)
        sequence.push(x2)
      })

      await result.all()
      const after = Date.now()

      expect(sequence).to.deep.eq([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90,
      ])
      expect(after - before).to.be.greaterThan(605) // 100 + 90 + 80 + ...
    })

    it('can flatMap to an array', async () => {
      const values = [0, 1, 2]
      const subject = SequentialAsyncList.lift(values)
      const result = subject.flatMap(async (x) => {
        return upTo(x)
      })

      expect(await result.all()).to.deep.eq([
        0,
        0, 1,
        0, 1, 2,
      ])
    })

    it('can flatMap to an array of promises of arrays', async () => {
      const values = [1, 2, 3]
      const subject = SequentialAsyncList.lift(values)
      const result = subject.flatMap((x) => {
        return upTo(x).map(async (x2) => (
          upTo(x2)
        ))
      })

      expect(await result.all()).to.deep.eq([
        0,
        0, 1,
        0,
        0, 1,
        0, 1, 2,
        0,
        0, 1,
        0, 1, 2,
        0, 1, 2, 3,
      ])
    })
  })

  describe('reduce', () => {
    it('reduces in sequence', async () => {
      const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const subject = SequentialAsyncList.lift(values)

      const result = await subject.reduce(async (current, x) => {
        await wait(10 - x)
        return `${current}-${x}`
      }, '|')

      expect(result).to.eq('|-0-1-2-3-4-5-6-7-8-9')
    })
  })

  describe('all', () => {
    it('gets all results', async () => {
      const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const subject = SequentialAsyncList.lift(values)

      const result = await subject.map((x) => x * 2).all()
      expect(result).to.deep.equal([0, 2, 4, 6, 8, 10, 12, 14, 16, 18])
    })
  })
})

function upTo(n: number): number[] {
  const arr = [] as number[]
  for (let i = 0; i <= n; i++) {
    arr.push(i)
  }
  return arr
}
