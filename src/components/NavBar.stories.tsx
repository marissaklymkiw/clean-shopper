import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { MemoryRouter } from 'react-router-dom'
import { NavBar } from './NavBar'

const meta = {
  component: NavBar,
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof NavBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { active: 'home' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('banner')).toBeVisible()
    const cartBtn = canvas.getByRole('button', { name: /cart/i })
    await expect(cartBtn).toBeVisible()
  },
}

export const WithCartItems: Story = {
  args: { active: 'home', cartCount: 3 },
}

export const WithSearch: Story = {
  args: {
    active: 'home',
    searchQuery: 'shampoo',
    onSearchChange: () => {},
  },
}

export const ChatActive: Story = {
  args: { active: 'chat' },
}
