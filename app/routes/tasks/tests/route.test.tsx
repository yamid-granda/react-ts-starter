import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { describe, expect, it, vi } from 'vitest'
import { MOCK_TODOS_URL, mockTodos } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import Tasks from '../route'

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
  it('loads and refreshes tasks', async () => {
    const user = userEvent.setup()
    const requestHandler = vi.fn(() => HttpResponse.json(mockTodos))
    server.use(http.get(MOCK_TODOS_URL, requestHandler))

    renderTasks()

    expect(screen.getByText('Loading tasks…')).toBeVisible()
    expect(await screen.findByText('Write the tasks demo')).toBeVisible()
    expect(requestHandler).toHaveBeenCalledTimes(1)

    expect(screen.getByText('Open')).toBeVisible()
    expect(screen.getByText('Done')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(requestHandler).toHaveBeenCalledTimes(2)
  })

  it('shows an error and retries', async () => {
    const user = userEvent.setup()
    const requestHandler = vi.fn(() => new HttpResponse(null, { status: 500 }))
    server.use(http.get(MOCK_TODOS_URL, requestHandler))

    renderTasks()

    expect(await screen.findByRole('alert')).toHaveTextContent('Request failed with status 500')

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(requestHandler).toHaveBeenCalledTimes(2))
  })
})
