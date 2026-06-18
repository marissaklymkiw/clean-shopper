import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-md p-xl text-center font-body text-text bg-bg">
          <h1 className="font-display text-h2 text-error">Something went wrong</h1>
          <pre className="max-w-prose rounded-md bg-surface p-md text-left text-small text-text-muted shadow-sm overflow-auto">
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-accent px-lg py-sm text-body font-medium text-surface hover:bg-accent-hover"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
