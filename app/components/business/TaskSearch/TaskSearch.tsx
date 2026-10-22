import { useDeferredValue, useId, useMemo, useState } from 'react'
import type { Todo } from '@/services/api/tasks/types'
import { cn } from '@/utils/cn'

type TaskSearchProps = {
  todos: Todo[]
}

export function TaskSearch({ todos }: TaskSearchProps) {
  const searchId = useId()
  const [searchText, setSearchText] = useState('')

  const deferredSearchText = useDeferredValue(searchText)

  const filteredTodos = useMemo(() => {
    const query = deferredSearchText.trim().toLowerCase()
    if (!query) return todos
    return todos.filter((todo) => todo.title.toLowerCase().includes(query))
  }, [todos, deferredSearchText])

  return (
    <div>
      <label className="sr-only" htmlFor={searchId}>
        Search tasks
      </label>
      <input
        id={searchId}
        type="search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search tasks…"
        className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2"
      />

      {filteredTodos.length === 0 ? (
        <p className="py-6 text-center text-slate-500 text-sm">No tasks found.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between gap-4 py-3">
              <span className="text-slate-700 text-sm">{todo.title}</span>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 font-medium text-xs',
                  todo.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
                )}
              >
                {todo.completed ? 'Done' : 'Open'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
