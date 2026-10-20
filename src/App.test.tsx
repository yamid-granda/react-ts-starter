import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('increments and resets the counter', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Count: 0' }))
    expect(screen.getByRole('button', { name: 'Count: 1' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByRole('button', { name: 'Count: 0' })).toBeInTheDocument()
  })
})
