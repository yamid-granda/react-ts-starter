import { beforeEach, describe, expect, it } from 'vitest'
import { useCounterStore } from './counter'

describe('counter store', () => {
  beforeEach(() => {
    useCounterStore.setState(useCounterStore.getInitialState(), true)
  })

  it('starts at zero', () => {
    expect(useCounterStore.getState().count).toBe(0)
  })

  it('increments the count', () => {
    useCounterStore.getState().increment()

    expect(useCounterStore.getState().count).toBe(1)
  })

  it('resets the count', () => {
    useCounterStore.getState().increment()
    useCounterStore.getState().reset()

    expect(useCounterStore.getState().count).toBe(0)
  })
})
