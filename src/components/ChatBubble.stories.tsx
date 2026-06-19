import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ChatBubble } from './ChatBubble'

const meta = {
  component: ChatBubble,
  tags: ['ai-generated'],
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

export const UserMessage: Story = {
  args: { role: 'user', content: 'Is this shampoo safe for sensitive skin?' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/sensitive skin/i)).toBeVisible()
  },
}

export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    content: 'Yes! This shampoo scores **88 / 100** — it contains:\n\n- No parabens\n- No sulfates\n\nIt\'s a *clean* pick for sensitive skin.',
  },
}

export const LoadingIndicator: Story = {
  args: { role: 'assistant', content: '', loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Thinking…')).toBeVisible()
  },
}
