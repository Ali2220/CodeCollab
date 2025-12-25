/*
 * ============================================
 * BUTTON COMPONENT - Reusable Button
 * ============================================
 * 
 * This is a reusable button component that can be used throughout the app.
 * 
 * Props (inputs):
 * - children: The text or content inside the button
 * - variant: The style of button ('primary', 'secondary', or 'danger')
 * - disabled: Whether the button is disabled (true/false)
 * - onClick: Function to run when button is clicked
 * - type: Button type ('button' or 'submit' for forms)
 * - className: Additional custom styles
 * 
 * Example usage:
 * <Button variant="primary" onClick={handleClick}>Click Me</Button>
 */

const Button = ({
  children,
  variant = "primary",      // Default is primary style
  disabled = false,          // Default is not disabled
  onClick,
  type = "button",          // Default is regular button
  className = "",           // Default is no extra styles
}) => {
  // ============================================
  // STYLES
  // ============================================
  
  // Base styles that all buttons have
  const baseStyles =
    "px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // Different styles for different button types
  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // Combine all styles: base + variant + custom
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
