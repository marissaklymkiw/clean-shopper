import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { SafetyBadge } from './SafetyBadge'

const meta = {
  component: SafetyBadge,
  tags: ['ai-generated'],
} satisfies Meta<typeof SafetyBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Clean: Story = {
  args: { level: 'clean' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Clean')).toBeVisible()
  },
}

export const CleanWithScore: Story = {
  args: { level: 'clean', score: 88 },
}

export const Caution: Story = {
  args: { level: 'caution' },
}

export const CautionWithScore: Story = {
  args: { level: 'caution', score: 55 },
}

export const Avoid: Story = {
  args: { level: 'avoid' },
}

export const AvoidWithScore: Story = {
  args: { level: 'avoid', score: 18 },
}

export const CustomLabel: Story = {
  args: { level: 'clean', label: 'EWG Verified' },
}
