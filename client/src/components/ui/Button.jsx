
const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm",

  secondary:
    "bg-primary-light text-primary hover:bg-indigo-100",

  outline:
    "border border-border-main bg-white text-navy hover:bg-slate-50",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        inline-flex min-h-11 items-center justify-center
        gap-2 rounded-xl px-5 py-3
        text-sm font-semibold
        transition-all duration-200
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}

export default Button;