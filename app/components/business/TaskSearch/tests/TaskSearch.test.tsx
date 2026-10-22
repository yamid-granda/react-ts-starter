import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Todo } from '@/services/api/tasks/types'
import { TaskSearch } from '../TaskSearch'

const todos: Todo[] = [
  {
    userId: 1,
    id: 1,
    title: 'Write the tasks demo',
    completed: false,
  },
  {
    userId: 1,
    id: 2,
    title: 'Review the search input',
    completed: true,
  },
]

describe('TaskSearch', () => {
  it('renders all tasks initially', () => {
    render(<TaskSearch todos={todos} />)

    expect(screen.getByText('Write the tasks demo')).toBeInTheDocument()
    expect(screen.getByText('Review the search input')).toBeInTheDocument()
  })

  it('filters tasks by title', async () => {
    const user = userEvent.setup()
    render(<TaskSearch todos={todos} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search tasks' }), 'REVIEW')

    expect(screen.getByText('Review the search input')).toBeInTheDocument()
    expect(screen.queryByText('Write the tasks demo')).not.toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    render(<TaskSearch todos={todos} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search tasks' }), 'missing')

    expect(screen.getByText('No tasks found.')).toBeInTheDocument()
  })
})
