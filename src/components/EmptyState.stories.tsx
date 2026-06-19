import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { EmptyState } from './EmptyState'
import { Button } from './Button'

const meta = {
  component: EmptyState,
  tags: ['ai-generated'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No products in this category yet',
    description: 'Try another category, or check back as the catalog grows.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /no products/i })).toBeVisible()
  },
}

export const WithAction: Story = {
  render: () => (
    <EmptyState
      title="Your cart is empty"
      description="Browse products and add items to build your clean shopping list."
      icon="🛒"
      action={<Button variant="primary">Browse products</Button>}
    />
  ),
}

export const ErrorTone: Story = {
  render: () => (
    <EmptyState
      title="Couldn't load products"
      description="Check your connection and try again."
      icon="⚠"
      tone="error"
      action={<Button variant="secondary">Try again</Button>}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /couldn't load/i })).toBeVisible()
  },
}

export const NoResults: Story = {
  args: {
    title: 'No results found',
    description: 'No products matched your search. Try a different name or brand.',
    icon: '🔍',
  },
}
