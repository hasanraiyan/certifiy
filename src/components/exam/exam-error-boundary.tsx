import React from "react";

interface ExamErrorBoundaryProps {
  children: React.ReactNode;
}

interface ExamErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ExamErrorBoundary extends React.Component<ExamErrorBoundaryProps, ExamErrorBoundaryState> {
  constructor(props: ExamErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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
