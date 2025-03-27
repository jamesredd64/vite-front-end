import type React from "react";
import type { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  prefix?: string;
  isCurrency?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  prefix,
  isCurrency = false,
}) => {
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;
  
  if (prefix) {
    inputClasses += ' pl-7';
  }

  // Handle currency formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrency) {
      let value = e.target.value;
      
      // Remove all non-numeric characters except decimal point
      value = value.replace(/[^\d.]/g, '');
      
      // Handle multiple decimal points
      const decimalPoints = value.match(/\./g)?.length || 0;
      if (decimalPoints > 1) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      // Create a new event with the cleaned value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: value
        }
      };
      
      onChange?.(newEvent);
    } else {
      onChange?.(e);
    }
  };

  // Format the display value for currency only when the input is not focused
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isCurrency && e.target.value) {
      const numValue = parseFloat(e.target.value);
      if (!isNaN(numValue)) {
        const formattedValue = numValue.toFixed(2);
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(newEvent);
      }
    }
  };

  // For currency inputs, display the raw value while typing
  const displayValue = value !== undefined && value !== '' ? value : '';

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          {prefix}
        </span>
      )}
      <input
        type={isCurrency ? "text" : type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step || (isCurrency ? 0.01 : undefined)}
        disabled={disabled}
        className={inputClasses}
      />
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;



