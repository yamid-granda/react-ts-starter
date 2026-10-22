import { Button } from '@/components/Button/Button'
import { useGetTasks } from '@/services/api/tasks/getTasks/useGetTasks'
import { cn } from '@/utils/cn'

export default function Tasks() {
  const { data, isPending, isError, error, isFetching, refetch } = useGetTasks()
  const todos = data ?? []

  return (
    <section className="space-y-6">
      <title>Tasks — React + TypeScript Starter</title>
      <meta
        name="description"
        content="A TanStack Query demo fetching tasks from JSONPlaceholder."
      />

      <p className="font-mono text-indigo-600 text-xs uppercase tracking-[0.18em]">Server state</p>
      <h1 className="text-balance font-semibold text-4xl text-slate-900 tracking-tight sm:text-5xl">
        Tasks with TanStack Query
      </h1>
      <p className="max-w-xl text-base text-slate-600 leading-7">
        Fetched from JSONPlaceholder with <code>useQuery</code>. The query is cached for 30 seconds,
        so navigating away and back reuses the previous result.
      </p>

      <div className="rounded-card border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Demo tasks</h2>
            <p className="mt-1 text-slate-500 text-sm">
              Public API · <span className="font-mono text-xs">/todos?_limit=6</span>
            </p>
          </div>
          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            Refresh
          </Button>
        </div>

        <div aria-busy={isFetching} className="mt-4">
          {isPending ? (
            <p className="py-6 text-center text-slate-500 text-sm">Loading tasks…</p>
          ) : isError ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-700" role="alert">
              <p className="font-medium text-sm">Could not load tasks.</p>
              <p className="mt-1 text-red-600 text-sm">{error?.message}</p>
              <Button className="mt-3" variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todos.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-slate-700 text-sm">{todo.title}</span>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 font-medium text-xs',
                      todo.completed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700',
                    )}
                  >
                    {todo.completed ? 'Done' : 'Open'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-xs">
        This page needs network access. Unit tests mock the API so they stay deterministic.
      </p>
    </section>
  )
}
