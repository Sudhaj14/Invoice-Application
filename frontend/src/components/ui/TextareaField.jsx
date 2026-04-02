import React from "react";

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  rows = 3,
  error = "",
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-xl border transition-all duration-300
          text-sm text-white placeholder:text-text-muted
          bg-white/5 backdrop-blur-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 focus:bg-white/10
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-white/10 hover:border-white/20"}
          ${className}
        `}
      />

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextareaField;