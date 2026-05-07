import React from "react";

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
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In a real app, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div
          className="error-boundary"
          style={{
            padding: "20px",
            margin: "20px",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
          }}
        >
          <h2 style={{ margin: "0 0 16px 0" }}>Oops! Something went wrong</h2>
          <p style={{ margin: "0 0 16px 0" }}>
            We're sorry, but something unexpected happened. Please try
            refreshing the page.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Refresh Page
            </button>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details style={{ marginTop: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontSize: "12px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
