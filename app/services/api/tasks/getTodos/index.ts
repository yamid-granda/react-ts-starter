import type { Todo } from '../types'

export const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=6'

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(TODOS_URL)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<Todo[]>
}
