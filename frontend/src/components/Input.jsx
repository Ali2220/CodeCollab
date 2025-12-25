/*
 * ============================================
 * INPUT COMPONENT - Reusable Input Field
 * ============================================
 * 
 * This is a reusable input field component for forms.
 * 
 * Props (inputs):
 * - label: Text label above the input
 * - type: Input type ('text', 'email', 'password', etc.)
 * - placeholder: Placeholder text inside input
 * - value: Current value of the input
 * - onChange: Function to run when input changes
 * - error: Error message to display (if any)
 * - required: Whether this field is required
 * - name: Name attribute for the input
 * 
 * Example usage:
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   value={email} 
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 * />
 */

const Input = ({
  label,
  type = "text",           // Default is text input
  placeholder,
  value,
  onChange,
  error,
  required = false,        // Default is not required
  name,
}) => {
  return (
    <div className="mb-4">
      {/* ============================================
          LABEL
          ============================================ */}
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label}
          {/* Show red asterisk if field is required */}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* ============================================
          INPUT FIELD
          ============================================ */}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        // Change border color to red if there's an error
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-primary-500 focus:border-transparent"
          }`}
      />

      {/* ============================================
          ERROR MESSAGE
          ============================================ */}
      {/* Show error message if there is one */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
