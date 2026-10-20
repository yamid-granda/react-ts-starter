import { useState } from 'react'
import { Button } from './Button'

export const Primary = () => <Button>Click me</Button>

export const Secondary = () => <Button variant="secondary">Click me</Button>

export const Disabled = () => <Button disabled>Click me</Button>

export const CountsClicks = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button onClick={() => setCount((value) => value + 1)}>Click me</Button>
      <form hidden>
        <input data-testid="click-count" readOnly value={String(count)} />
      </form>
    </>
  )
}
