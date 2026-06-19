import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from './Button'

const meta = {
  component: Button,
  tags: ['ai-generated'],
  args: { children: 'Button label' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Add to cart' },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'Add to cart' })
    await expect(btn).toBeVisible()
    await expect(btn).not.toBeDisabled()
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Compare' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Quick add' },
}

export const Loading: Story = {
  args: { variant: 'primary', children: 'Saving…', loading: true },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'Saving…' })
    await expect(btn).toBeDisabled()
    await expect(btn).toHaveAttribute('aria-busy', 'true')
  },
}

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Unavailable', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  },
}

export const DisabledSecondary: Story = {
  args: { variant: 'secondary', children: 'Compare', disabled: true },
}
