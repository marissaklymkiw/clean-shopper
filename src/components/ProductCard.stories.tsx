import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ProductCard } from './ProductCard'

const meta = {
  component: ProductCard,
  tags: ['ai-generated'],
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

export const Clean: Story = {
  args: {
    name: 'Gentle Face Wash',
    brand: 'Evergreen',
    safety: 'clean',
    score: 88,
    category: 'Personal Care',
    onSave: () => {},
    onAddToCart: () => {},
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('article')).toBeVisible()
    await expect(canvas.getByText('Clean · 88')).toBeVisible()
  },
}

export const CssCheck: Story = {
  args: {
    name: 'Test Product',
    safety: 'clean',
    score: 90,
    category: 'Personal Care',
    inCart: true,
    onAddToCart: () => {},
  },
  play: async ({ canvas }) => {
    // aria-label is "Remove from cart" when inCart=true
    const btn = canvas.getByRole('button', { name: /remove from cart/i })
    // bg-accent = #237055 (tailwind.config.js) — fails if Tailwind/global CSS did not load
    await expect(getComputedStyle(btn).backgroundColor).toBe('rgb(35, 112, 85)')
  },
}

export const Caution: Story = {
  args: {
    name: 'Standard Shampoo',
    brand: 'CommonBrand',
    safety: 'caution',
    score: 55,
    category: 'Hair Care',
  },
}

export const Avoid: Story = {
  args: {
    name: 'Harsh Cleaner',
    safety: 'avoid',
    score: 22,
    category: 'Cleaning',
  },
}

export const Loading: Story = {
  args: {
    name: '',
    safety: 'clean',
    category: '',
    loading: true,
  },
}

export const Saved: Story = {
  args: {
    name: 'Saved Product',
    safety: 'clean',
    score: 80,
    category: 'Personal Care',
    saved: true,
    onSave: () => {},
  },
}
