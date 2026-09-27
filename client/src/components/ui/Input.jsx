import { useId } from "react";

function Input({
  label,
  type = "text",
  placeholder,
  error,
  id,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-navy"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full rounded-xl border bg-white
          px-4 py-3 text-sm text-navy
          placeholder:text-slate-400
          outline-none transition-colors
          focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:bg-slate-50
          ${
            error
              ? "border-danger focus:border-danger"
              : "border-border-main focus:border-primary"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;