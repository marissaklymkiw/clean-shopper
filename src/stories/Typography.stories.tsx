import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Design System/Typography',
  tags: ['ai-generated'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const TYPE_SCALE = [
  { token: 'text-display', fontClass: 'font-display', label: 'Display', size: '49px / 3.052rem', weight: '600', family: 'Fraunces', sample: 'Clean choices, made clear.' },
  { token: 'text-h1',      fontClass: 'font-display', label: 'H1',      size: '39px / 2.441rem', weight: '600', family: 'Fraunces', sample: 'Browse clean products' },
  { token: 'text-h2',      fontClass: 'font-display', label: 'H2',      size: '31px / 1.953rem', weight: '600', family: 'Fraunces', sample: 'Personal Care' },
  { token: 'text-h3',      fontClass: 'font-display', label: 'H3',      size: '25px / 1.563rem', weight: '500', family: 'Fraunces', sample: 'Gentle Face Wash' },
  { token: 'text-body',    fontClass: 'font-body',    label: 'Body',    size: '16px / 1rem',     weight: '400', family: 'Plus Jakarta Sans', sample: 'Researched against your standards — every item is scored and explained.' },
  { token: 'text-small',   fontClass: 'font-body',    label: 'Small',   size: '13px / 0.8rem',   weight: '400', family: 'Plus Jakarta Sans', sample: 'PERSONAL CARE · Clean · 88' },
]

export const Typography: Story = {
  render: () => (
    <div className="min-h-screen bg-bg p-xl">
      <h1 className="mb-sm font-display text-h1 text-text">Typography Scale</h1>
      <p className="mb-xl text-body text-text-muted">
        Display and headings use <strong>Fraunces</strong> (serif). Body and UI copy use <strong>Plus Jakarta Sans</strong>.
      </p>
      <div className="flex flex-col">
        {TYPE_SCALE.map((t) => (
          <div key={t.token} className="flex flex-col gap-xs border-b border-border py-xl last:border-none">
            <div className="flex flex-wrap items-baseline gap-md">
              <code className="font-mono text-small text-text-muted">{t.token}</code>
              <span className="text-small text-text-muted">{t.size} · {t.weight}w · {t.family}</span>
            </div>
            <span className={`${t.token} ${t.fontClass} text-text`}>{t.sample}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}
