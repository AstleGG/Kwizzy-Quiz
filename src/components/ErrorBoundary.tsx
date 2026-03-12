import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
          <div className="mb-6 rounded-full bg-red-50 p-6 text-red-500">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black">Something went wrong</h1>
          <p className="mt-2 text-black/60">
            We've encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-full bg-black px-8 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 max-w-2xl overflow-auto rounded-xl bg-black/5 p-4 text-left text-xs text-black/40">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return (this as any).props.children;
  }
}
