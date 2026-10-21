import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTodos } from '@/lib/tasks-api'
import { useCounterStore } from '@/stores/counter'
import App from './root'
import Home from './routes/_index'
import Other from './routes/other'
import Tasks from './routes/tasks'

vi.mock('@/lib/tasks-api', () => ({
  fetchTodos: vi.fn(),
}))

const fetchTodosMock = vi.mocked(fetchTodos)

function renderApp(initialEntries: string[] = ['/']) {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: App,
      children: [
        { index: true, Component: Home },
        { path: 'other', Component: Other },
        { path: 'tasks', Component: Tasks },
      ],
    },
  ])

  return render(<Stub initialEntries={initialEntries} />)
}

describe('App', () => {
  beforeEach(() => {
    useCounterStore.setState(useCounterStore.getInitialState(), true)
    fetchTodosMock.mockReset()
    fetchTodosMock.mockResolvedValue([
      {
        userId: 1,
        id: 1,
        title: 'Write the tasks demo',
        completed: false,
      },
    ])
  })

  it('increments and resets the counter', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Count: 0' }))
    expect(screen.getByRole('button', { name: 'Count: 1' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByRole('button', { name: 'Count: 0' })).toBeInTheDocument()
  })

  it('navigates between the home and other pages', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(
      screen.getByRole('heading', { name: 'A starter with the boring parts already done.' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Other' }))
    expect(screen.getByRole('heading', { name: 'This is the other page.' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(
      screen.getByRole('heading', { name: 'A starter with the boring parts already done.' }),
    ).toBeInTheDocument()
  })

  it('navigates to the tasks page', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(screen.getByRole('heading', { name: 'Tasks with TanStack Query' })).toBeInTheDocument()
    expect(await screen.findByText('Write the tasks demo')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(
      screen.getByRole('heading', { name: 'A starter with the boring parts already done.' }),
    ).toBeInTheDocument()
  })

  it('renders the other page directly', () => {
    renderApp(['/other'])

    expect(screen.getByRole('heading', { name: 'This is the other page.' })).toBeInTheDocument()
  })
})
