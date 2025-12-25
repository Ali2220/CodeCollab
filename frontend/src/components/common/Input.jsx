/**
 * Reusable Input Component
 * Props:
 * - label: Input label
 * - type: 'text' | 'email' | 'password'
 * - placeholder: Placeholder text
 * - value: Input value
 * - onChange: Change handler
 * - error: Error message
 * - required: boolean
 */
const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  name,
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-primary-500 focus:border-transparent"
          }`}
      />

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
