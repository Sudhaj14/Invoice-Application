import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-deep transform active:scale-95";

  const variants = {
    primary:
      "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:-translate-y-0.5 hover:scale-[1.02] focus:ring-accent-blue",
    secondary:
      "bg-white/5 text-text-primary hover:bg-white/10 border border-white/10 hover:border-white/20 focus:ring-accent-blue",
    danger:
      "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:ring-red-500",
    outline:
      "border border-white/20 text-text-primary hover:bg-white/5 hover:border-white/40 focus:ring-accent-purple",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const finalClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children}
    </button>
  );
};

export default Button;