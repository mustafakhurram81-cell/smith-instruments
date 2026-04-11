import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Only log in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-brand-charcoal mb-3">Something went wrong</h1>
        <p className="text-stone-500 text-lg font-light mb-8">
          We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
        </p>

        {/* Show error message in development only */}
        {import.meta.env.DEV && error && (
          <pre className="text-left text-xs bg-stone-100 border border-stone-200 rounded-lg p-4 mb-8 overflow-auto text-red-600 max-h-40">
            {error.message}
          </pre>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-brand-orange text-white font-bold rounded-md hover:bg-brand-orange/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-3 border border-stone-300 text-brand-charcoal font-bold rounded-md hover:bg-stone-100 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary = ErrorBoundaryClass;
