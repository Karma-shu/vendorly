import React from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500 disabled:bg-secondary-300',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300',
    ghost: 'text-primary hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-300'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const isDisabled = disabled || isLoading
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className={`animate-spin -ml-1 mr-3 ${iconSizeClasses[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizeClasses[size]} ${children ? 'ml-2' : ''}`} />
          )}
        </>
      )}
    </button>
  )
}