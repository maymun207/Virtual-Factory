/**
 * ErrorBoundary — Catches render errors in the 3D scene
 * so a WebGL crash doesn't take down the entire UI.
 */
import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex items-center justify-center bg-black text-white">
            <div className="text-center p-8 max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-400 mb-2">
                Scene Failed to Load
              </h2>
              <p className="text-white/60 text-sm mb-4">
                The 3D scene encountered an error. Try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
              >
                Refresh Page
              </button>
              {this.state.error && (
                <pre className="mt-4 text-xs text-white/40 text-left overflow-auto max-h-32 p-2 bg-white/5 rounded">
                  {this.state.error.message}
                </pre>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
