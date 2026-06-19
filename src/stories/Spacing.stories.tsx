import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Design System/Spacing',
  tags: ['ai-generated'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SPACING_TOKENS = [
  { token: 'xs',  px: 4,  rem: '0.25rem' },
  { token: 'sm',  px: 8,  rem: '0.5rem'  },
  { token: 'md',  px: 16, rem: '1rem'    },
  { token: 'lg',  px: 24, rem: '1.5rem'  },
  { token: 'xl',  px: 40, rem: '2.5rem'  },
  { token: '2xl', px: 64, rem: '4rem'    },
  { token: '3xl', px: 96, rem: '6rem'    },
]

export const Spacing: Story = {
  render: () => (
    <div className="min-h-screen bg-bg p-xl">
      <h1 className="mb-sm font-display text-h1 text-text">Spacing Scale</h1>
      <p className="mb-xl text-body text-text-muted">
        Base 4px, used as <code className="text-small">p-*</code>, <code className="text-small">gap-*</code>, <code className="text-small">m-*</code>.
      </p>
      <div className="flex flex-col gap-md">
        {SPACING_TOKENS.map((t) => (
          <div key={t.token} className="flex items-center gap-lg">
            <code className="w-10 shrink-0 font-mono text-small text-text-muted">{t.token}</code>
            <div
              className="shrink-0 rounded-sm bg-accent/30"
              style={{ width: t.px, height: 24 }}
            />
            <span className="text-small text-text-muted">{t.px}px / {t.rem}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}
