import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    let msg = error.message || 'An unexpected error occurred.';
    try {
      const parsed = JSON.parse(msg);
      if (parsed && parsed.error) {
        msg = `${parsed.error} (${parsed.operationType} on ${parsed.path || 'database'})`;
      }
    } catch {
      // keep raw message
    }
    return { hasError: true, errorMessage: msg };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0d11] text-stone-100 p-4">
          <div className="max-w-md w-full rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-serif-luxury text-amber-200">
              Something went wrong
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed break-words">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs text-stone-950 bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
