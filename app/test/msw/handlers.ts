import { HttpResponse, http } from 'msw/http'
import type { Todo } from '@/services/api/tasks/types'

export const MOCK_TODOS_URL = '**jsonplaceholder.typicode.com/todos**'

export const mockTodos = [
  {
    userId: 1,
    id: 1,
    title: 'Write the tasks demo',
    completed: false,
  },
  {
    userId: 1,
    id: 2,
    title: 'Render the task list',
    completed: true,
  },
] satisfies Todo[]

export const handlers = [http.get(MOCK_TODOS_URL, () => HttpResponse.json(mockTodos))]
