import Alert from "./Alert";
import { SetStateAction } from "react";

interface FormErrorProps {
  error?: string;
  setError: (value: SetStateAction<string | undefined>) => void;
}

export default function FormError({ error, setError }: FormErrorProps) {
  if (!error) return null;

  return (
    <Alert onDismiss={() => setError(undefined)} variant="error">
      {error}
    </Alert>
  );
}
