import PropTypes from "prop-types";

export default function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full rounded-md bg-white/10 border border-gray-600 px-3 py-2 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 focus:bg-white/20 transition-all"
      />
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
