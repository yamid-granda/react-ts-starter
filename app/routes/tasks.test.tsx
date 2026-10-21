import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTodos } from '@/lib/tasks-api'
import Tasks from './tasks'

vi.mock('@/lib/tasks-api', () => ({
  fetchTodos: vi.fn(),
}))

const fetchTodosMock = vi.mocked(fetchTodos)

const todos = [
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
]

function renderTasks() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <Tasks />
    </QueryClientProvider>,
  )
}

describe('Tasks', () => {
  beforeEach(() => {
    fetchTodosMock.mockReset()
  })

  it('loads and refreshes tasks', async () => {
    const user = userEvent.setup()
    fetchTodosMock.mockResolvedValue(todos)

    renderTasks()

    expect(screen.getByText('Loading tasks…')).toBeInTheDocument()
    expect(await screen.findByText('Write the tasks demo')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Refresh' }))
    await waitFor(() => expect(fetchTodosMock).toHaveBeenCalledTimes(2))
  })

  it('shows an error and retries', async () => {
    const user = userEvent.setup()
    fetchTodosMock.mockRejectedValue(new Error('Service unavailable'))

    renderTasks()

    expect(await screen.findByRole('alert')).toHaveTextContent('Service unavailable')

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(fetchTodosMock).toHaveBeenCalledTimes(2))
  })
})
