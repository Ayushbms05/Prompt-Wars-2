/**
 * ErrorBoundary.jsx — Catches render errors and displays a user-friendly fallback.
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary class component to catch JavaScript errors anywhere in their child component tree.
 */
export default class ErrorBoundary extends Component {
  /**
   * @param {Object} props - Component props.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Updates state so the next render will show the fallback UI.
   * @param {Error} error - The error that was thrown.
   * @returns {{hasError: boolean, error: Error}} The new state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Resets the error state to allow retrying the component load.
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * @returns {JSX.Element} The rendered component or fallback UI.
   */
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
  /** The child components to wrap */
  children: PropTypes.node.isRequired,
  /** Optional title for the error message */
  title: PropTypes.string,
};
