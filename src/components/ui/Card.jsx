import React from 'react';

const Card = React.forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  interactive = false,
  ...props
}, ref) => {
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'bg-slate-800 border border-slate-700',
    elevated: 'bg-slate-800 border border-slate-700 shadow-soft hover:shadow-soft-lg',
    outlined: 'bg-slate-800/50 border border-slate-700 backdrop-blur-sm',
    ghost: 'bg-slate-800/50 border border-transparent hover:bg-slate-800',
    gradient: 'bg-gradient-to-br from-indigo-600 to-indigo-700 border border-indigo-600 text-white'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const interactiveClasses = (onClick || interactive) 
    ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:border-slate-600' 
    : '';

  const classes = [
    baseClasses,
    variants[variant],
    paddings[padding],
    interactiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-slate-100 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-slate-700 ${className}`}>
    {children}
  </div>
);

export default Card;
