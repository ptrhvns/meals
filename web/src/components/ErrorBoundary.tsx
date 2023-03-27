import ErrorBoundaryPage from "../routes/ErrorBoundaryPage";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State { // eslint-disable-line @typescript-eslint/no-unused-vars
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("An uncaught error occurred:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorBoundaryPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
