import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Design System/Shadows',
  tags: ['ai-generated'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SHADOW_TOKENS = [
  { cls: 'shadow-sm', label: 'sm', usage: 'Navbar, subtle lift',         value: '0 1px 2px rgba(35,41,31,0.05)' },
  { cls: 'shadow-md', label: 'md', usage: 'Cards (default)',             value: '0 6px 18px rgba(35,41,31,0.07)' },
  { cls: 'shadow-lg', label: 'lg', usage: 'Card hover, drawers, modals', value: '0 16px 40px rgba(35,41,31,0.10)' },
]

export const Shadows: Story = {
  render: () => (
    <div className="min-h-screen bg-bg p-xl">
      <h1 className="mb-sm font-display text-h1 text-text">Shadows</h1>
      <p className="mb-xl text-body text-text-muted">
        Soft, diffuse, warm-tinted using the dark green-charcoal at low opacity.
      </p>
      <div className="grid grid-cols-1 gap-xl sm:grid-cols-3">
        {SHADOW_TOKENS.map((t) => (
          <div key={t.label} className={`${t.cls} flex flex-col gap-sm rounded-lg bg-surface p-lg`}>
            <code className="font-mono text-small font-medium text-text">{t.label}</code>
            <span className="text-body text-text">{t.usage}</span>
            <code className="font-mono text-small text-text-muted">{t.value}</code>
          </div>
        ))}
      </div>
    </div>
  ),
}
