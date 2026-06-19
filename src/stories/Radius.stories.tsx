import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Design System/Radius',
  tags: ['ai-generated'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const RADIUS_TOKENS = [
  { cls: 'rounded-sm',   label: 'sm',   value: '6px',    desc: 'Badges, small tags' },
  { cls: 'rounded-md',   label: 'md',   value: '10px',   desc: 'Inputs, buttons, cards' },
  { cls: 'rounded-lg',   label: 'lg',   value: '16px',   desc: 'Panels, drawers, large cards' },
  { cls: 'rounded-full', label: 'full', value: '9999px', desc: 'Pills, chips, avatar frames' },
]

export const Radius: Story = {
  render: () => (
    <div className="min-h-screen bg-bg p-xl">
      <h1 className="mb-sm font-display text-h1 text-text">Border Radius</h1>
      <p className="mb-xl text-body text-text-muted">Soft, never sharp — matches the warm, approachable direction.</p>
      <div className="grid grid-cols-2 gap-xl sm:grid-cols-4">
        {RADIUS_TOKENS.map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-md text-center">
            <div className={`${t.cls} h-24 w-24 border border-accent/30 bg-accent/15`} />
            <div className="flex flex-col gap-xs">
              <code className="font-mono text-small font-medium text-text">{t.label}</code>
              <span className="text-small text-text-muted">{t.value}</span>
              <span className="text-small text-text-muted">{t.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}
