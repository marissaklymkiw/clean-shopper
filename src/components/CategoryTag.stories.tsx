import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { CategoryTag } from './CategoryTag'

const meta = {
  component: CategoryTag,
  tags: ['ai-generated'],
} satisfies Meta<typeof CategoryTag>

export default meta
type Story = StoryObj<typeof meta>

export const Static: Story = {
  args: { label: 'Personal Care' },
}

export const Interactive: Story = {
  args: { label: 'Cleaning', interactive: true },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'Cleaning' })
    await expect(btn).toHaveAttribute('aria-pressed', 'false')
  },
}

export const Selected: Story = {
  args: { label: 'Hair Care', interactive: true, selected: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Hair Care' })).toHaveAttribute('aria-pressed', 'true')
  },
}
