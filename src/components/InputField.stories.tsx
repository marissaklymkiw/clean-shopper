import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { InputField } from './InputField'

const meta = {
  component: InputField,
  tags: ['ai-generated'],
  args: { label: 'Brand name', value: '', onChange: () => {} },
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'e.g. Seventh Generation' },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Brand name')
    await expect(input).toBeVisible()
    await expect(input).not.toBeDisabled()
  },
}

export const WithHelperText: Story = {
  args: {
    helperText: 'Enter the brand exactly as it appears on packaging.',
    placeholder: 'e.g. Seventh Generation',
  },
}

export const WithError: Story = {
  args: {
    value: 'x',
    error: 'Brand name must be at least 2 characters.',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Brand name')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText(/at least 2 characters/i)).toBeVisible()
  },
}

export const Required: Story = {
  args: { required: true, placeholder: 'Required' },
}

export const Disabled: Story = {
  args: { value: 'Seventh Generation', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Brand name')).toBeDisabled()
  },
}

export const Filled: Story = {
  args: { value: 'Grove Collaborative' },
}
