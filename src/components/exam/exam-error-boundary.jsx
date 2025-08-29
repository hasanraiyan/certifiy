import React from "react";

export class ExamErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          <p className="text-muted-foreground">Please refresh the page or contact support if the problem persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ExamErrorBoundary;