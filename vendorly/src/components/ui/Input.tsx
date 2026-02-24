import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  fullWidth = true,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const hasError = !!error
  
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none
    ${LeftIcon ? 'pl-12' : 'pl-4'}
    ${RightIcon ? 'pr-12' : 'pr-4'}
    ${hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-200'
    }
    ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  const containerClasses = fullWidth ? 'w-full' : ''
  
  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {RightIcon && (
          <div 
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
            onClick={onRightIconClick}
          >
            <RightIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-2">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            helperText && <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'