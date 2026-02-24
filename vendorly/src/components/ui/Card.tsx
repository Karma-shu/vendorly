import React from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg'
  
  const variantClasses = {
    default: 'shadow-md border border-gray-200',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-gray-200'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 font-heading ${className}`}>
    {children}
  </h3>
)

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
)