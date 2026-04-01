import React, { forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  helper,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = error || (props['aria-invalid'] && props['aria-invalid'] !== 'false');

  const baseClasses = 'w-full px-4 py-3 rounded-xl bg-slate-800 border text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const borderClasses = hasError 
    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
    : isFocused 
      ? 'border-indigo-500 focus:ring-indigo-500 focus:border-indigo-500'
      : 'border-slate-700 focus:border-indigo-500';

  const classes = [
    baseClasses,
    borderClasses,
    className
  ].filter(Boolean).join(' ');

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={classes}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id || 'input'}-error` : helper ? `${props.id || 'input'}-helper` : undefined}
          {...props}
        />
        
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400">
            <AlertCircle size={20} />
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${props.id || 'input'}-error`} className="text-sm text-rose-400 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p id={`${props.id || 'input'}-helper`} className="text-sm text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  rows = 4,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      as="textarea"
      rows={rows}
      className="resize-none min-h-[100px]"
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Input;
