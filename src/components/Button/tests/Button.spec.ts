import { expect, test } from '@playwright/test'

test('renders the primary story', async ({ mount }) => {
  const component = await mount('Button/Primary')

  await expect(component.getByRole('button', { name: 'Click me' })).toBeVisible()
})

test('renders the disabled story', async ({ mount }) => {
  const component = await mount('Button/Disabled')

  await expect(component.getByRole('button', { name: 'Click me' })).toBeDisabled()
})

test('records clicks inside the story', async ({ mount }) => {
  const component = await mount('Button/CountsClicks')

  await component.getByRole('button', { name: 'Click me' }).click()

  await expect(component.getByTestId('click-count')).toHaveValue('1')
})
