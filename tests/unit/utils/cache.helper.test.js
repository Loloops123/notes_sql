import { describe, expect, it, jest } from '@jest/globals'
import { invalidateNotesCache } from '../../../src/utils/cache.helper.js'

const createAsyncIterator = (values) => ({
  [Symbol.asyncIterator]: async function* () {
    for (const value of values) {
      yield value
    }
  }
})

describe('invalidateNotesCache', () => {
  it('flattens keys and deletes them once', async () => {
    const redisClient = {
      scanIterator: jest.fn(() => createAsyncIterator([
        'notes:1:first',
        Buffer.from('notes:1:second'),
        ['notes:1:third', Buffer.from('notes:1:fourth')],
        null,
        undefined,
        ''
      ])),
      del: jest.fn()
    }

    await invalidateNotesCache(redisClient, 1)

    expect(redisClient.scanIterator).toHaveBeenCalledWith({ MATCH: 'notes:1:*' })
    expect(redisClient.del).toHaveBeenCalledTimes(1)
    expect(redisClient.del).toHaveBeenCalledWith(
      'notes:1:first',
      'notes:1:second',
      'notes:1:third',
      'notes:1:fourth'
    )
  })

  it('skips deletion when no keys found', async () => {
    const redisClient = {
      scanIterator: jest.fn(() => createAsyncIterator([])),
      del: jest.fn()
    }

    await invalidateNotesCache(redisClient, 'user-id')

    expect(redisClient.del).not.toHaveBeenCalled()
  })
})
