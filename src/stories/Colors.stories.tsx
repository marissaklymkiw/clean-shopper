import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Design System/Colors',
  tags: ['ai-generated'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const COLOR_TOKENS = [
  { label: 'Background',   hex: '#FAF7F1', usage: 'Warm cream page background' },
  { label: 'Surface',      hex: '#FFFFFF', usage: 'Cards, panels, inputs, bubbles' },
  { label: 'Text',         hex: '#23291F', usage: 'Headings and body text' },
  { label: 'Text Muted',   hex: '#5E6356', usage: 'Secondary text, captions, metadata' },
  { label: 'Accent',       hex: '#237055', usage: 'Primary actions, links, brand' },
  { label: 'Accent Hover', hex: '#1C5944', usage: 'Hover/active state of accent' },
  { label: 'Border',       hex: '#E7E2D8', usage: 'Dividers, input borders, card outlines' },
  { label: 'Success',      hex: '#2F7D4F', usage: '"Meets your standards" / positive states' },
  { label: 'Warning',      hex: '#7A5C00', usage: '"Check this" / caution states' },
  { label: 'Error',        hex: '#B23B33', usage: 'Avoided ingredients, errors, destructive' },
  { label: 'Info',         hex: '#3A6E8F', usage: 'Neutral informational states' },
]

export const Colors: Story = {
  render: () => (
    <div className="min-h-screen bg-bg p-xl">
      <h1 className="mb-sm font-display text-h1 text-text">Color Tokens</h1>
      <p className="mb-xl text-body text-text-muted">
        All colors are defined in <code className="text-small">tailwind.config.js</code> and
        referenced only via Tailwind classes — never hardcoded.
      </p>
      <div className="grid grid-cols-2 gap-lg sm:grid-cols-3 lg:grid-cols-4">
        {COLOR_TOKENS.map((t) => (
          <div key={t.label} className="flex flex-col gap-xs">
            <div
              className="h-16 w-full rounded-md border border-border shadow-sm"
              style={{ backgroundColor: t.hex }}
            />
            <span className="font-body text-small font-medium text-text">{t.label}</span>
            <code className="font-mono text-small text-text-muted">{t.hex}</code>
            <span className="text-small text-text-muted">{t.usage}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}
