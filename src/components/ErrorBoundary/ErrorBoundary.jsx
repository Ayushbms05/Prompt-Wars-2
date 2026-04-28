/**
 * ErrorBoundary.jsx — Catches render errors and displays a user-friendly fallback.
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <span className="error-boundary__icon" aria-hidden="true">⚠️</span>
            <h3 className="error-boundary__title">
              {this.props.title || 'Something went wrong'}
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

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};
