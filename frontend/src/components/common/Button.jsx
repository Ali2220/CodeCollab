/**
 * Reusable Button Component
 * Props:
 * - children: Button text
 * - variant: 'primary' | 'secondary' | 'danger'
 * - disabled: boolean
 * - onClick: function
 * - type: 'button' | 'submit'
 */
const Button = ({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  // Base button styles
  const baseStyles =
    "px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant-specific styles
  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
