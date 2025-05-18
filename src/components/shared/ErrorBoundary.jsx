import React from 'react';

/**
 * Error boundary component to prevent the entire app from crashing
 * when a component throws an error
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-dark-800 border border-dark-700 rounded-lg text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-medieval text-primary-300 mb-4">Something went wrong</h2>
          <p className="text-dark-300 mb-6">
            The component encountered an error. You can try refreshing the page.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="btn btn-primary"
          >
            Try again
          </button>
          
          {this.props.showDetails && this.state.error && (
            <div className="mt-6 p-4 bg-dark-900 rounded text-left overflow-auto text-xs text-dark-400">
              <p className="mb-2">{this.state.error.toString()}</p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;