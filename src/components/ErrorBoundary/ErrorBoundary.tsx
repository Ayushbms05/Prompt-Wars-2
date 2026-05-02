/**
 * ErrorBoundary.tsx — Catches render errors and displays a user-friendly fallback.
 */
import { Component, type ReactNode, type ErrorInfo } from 'react';
import logger from 'utils/logger';

/** Props for ErrorBoundary. */
interface ErrorBoundaryProps {
  /** The child components to wrap */
  readonly children: ReactNode;
  /** Optional title for the error message */
  readonly title?: string;
}

/** State for ErrorBoundary. */
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/**
 * ErrorBoundary class component to catch JavaScript errors.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <span className="error-boundary__icon" aria-hidden="true">⚠️</span>
            <h3 className="error-boundary__title">
              {this.props.title ?? 'Something went wrong'}
            </h3>
            <p className="error-boundary__message">
              This section encountered an error. Please try again or refresh the page.
            </p>
            <button
              className="error-boundary__btn"
              onClick={this.handleRetry}
              aria-label="Retry loading this section"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
