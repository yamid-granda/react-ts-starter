import { afterEach, describe, expect, it, vi } from 'vitest'
import { getTodos, TODOS_URL } from '../index'

const todos = [
  {
    userId: 1,
    id: 1,
    title: 'Write the demo',
    completed: false,
  },
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getTodos', () => {
  it('fetches todos from JSONPlaceholder', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => todos,
    })

    vi.stubGlobal('fetch', fetchMock)

    await expect(getTodos()).resolves.toEqual(todos)
    expect(fetchMock).toHaveBeenCalledWith(TODOS_URL)
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(getTodos()).rejects.toThrow('Request failed with status 500')
  })
})
