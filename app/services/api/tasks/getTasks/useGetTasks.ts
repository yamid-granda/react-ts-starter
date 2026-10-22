import { queryOptions, useQuery } from '@tanstack/react-query'
import { getTodosQueryKey } from '@/configs/queryKeys'
import { getTodos } from './index'

export const todosQuery = queryOptions({
  queryKey: getTodosQueryKey(),
  queryFn: getTodos,
})

export function useGetTasks() {
  return useQuery(todosQuery)
}
