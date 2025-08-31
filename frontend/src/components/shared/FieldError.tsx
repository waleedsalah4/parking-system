import { getFieldErrors } from "@/services/api";
interface FieldErrorProps {
  fieldName: string;
  error: unknown;
}
export function FieldError({ fieldName, error }: FieldErrorProps) {
  const fieldErrors = getFieldErrors(error);
  const messages = fieldErrors[fieldName];

  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 text-sm text-red-600">
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
}
