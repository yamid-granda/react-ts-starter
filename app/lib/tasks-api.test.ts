import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTodos, TODOS_URL } from './tasks-api'

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

describe('fetchTodos', () => {
  it('fetches todos from JSONPlaceholder', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => todos,
    })

    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchTodos()).resolves.toEqual(todos)
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

    await expect(fetchTodos()).rejects.toThrow('Request failed with status 500')
  })
})
