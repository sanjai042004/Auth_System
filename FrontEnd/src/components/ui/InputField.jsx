import { useState } from "react";
import PropTypes from "prop-types";
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";

export const InputField = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  showToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword((prev) => !prev);

  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:outline-none"
        />

        {showToggle && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
          >
            {showPassword ? (
              <LiaEyeSlashSolid size={20} />
            ) : (
              <LiaEyeSolid size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showToggle: PropTypes.bool,
};
