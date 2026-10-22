import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCounterStore } from '@/stores/counter'
import App from './root'
import Home from './routes/_index'
import OtherLayout from './routes/other/route'
import Other from './routes/other._index/route'
import OtherInnerPage from './routes/other.inner-page/route'
import Tasks from './routes/tasks/route'

function renderApp(initialEntries: string[] = ['/']) {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: App,
      children: [
        { index: true, Component: Home },
        {
          path: 'other',
          Component: OtherLayout,
          children: [
            { index: true, Component: Other },
            { path: 'inner-page', Component: OtherInnerPage },
          ],
        },
        { path: 'tasks', Component: Tasks },
      ],
    },
  ])

  return render(<Stub initialEntries={initialEntries} />)
}

describe('App', () => {
  beforeEach(() => {
    useCounterStore.setState(useCounterStore.getInitialState(), true)
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

  it('navigates to the inner page inside the other section', async () => {
    const user = userEvent.setup()
    renderApp(['/other'])

    await user.click(screen.getByRole('link', { name: 'Inner page' }))
    expect(screen.getByRole('heading', { name: 'This is the inner page.' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Back to other/ }))
    expect(screen.getByRole('heading', { name: 'This is the other page.' })).toBeInTheDocument()
  })

  it('renders the other page directly', () => {
    renderApp(['/other'])

    expect(screen.getByRole('heading', { name: 'This is the other page.' })).toBeInTheDocument()
  })

  it('renders the inner page directly', () => {
    renderApp(['/other/inner-page'])

    expect(screen.getByRole('heading', { name: 'This is the inner page.' })).toBeInTheDocument()
  })
})
