import ErrorBoundary from "../components/ErrorBoundary";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}
