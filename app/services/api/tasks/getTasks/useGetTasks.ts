import { queryOptions, useQuery } from '@tanstack/react-query'
import { getTodos } from './index'

export const todosQuery = queryOptions({
  queryKey: ['todos'],
  queryFn: getTodos,
})

export function useGetTasks() {
  return useQuery(todosQuery)
}
