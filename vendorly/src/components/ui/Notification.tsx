import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationProps {
  notification: ToastNotification
  onClose: (id: string) => void
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10)

    // Auto remove
    if (notification.duration !== 0) {
      const timeout = setTimeout(() => {
        handleClose()
      }, notification.duration || 5000)

      return () => clearTimeout(timeout)
    }
  }, [notification.duration])

  const handleClose = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onClose(notification.id)
    }, 300)
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      messageColor: 'text-green-700'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      messageColor: 'text-yellow-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700'
    }
  }

  const config = typeConfig[notification.type]
  const IconComponent = config.icon

  return (
    <div
      className={`
        max-w-sm w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${config.titleColor}`}>
            {notification.title}
          </p>
          {notification.message && (
            <p className={`mt-1 text-sm ${config.messageColor}`}>
              {notification.message}
            </p>
          )}
          {notification.action && (
            <div className="mt-3">
              <button
                onClick={notification.action.onClick}
                className={`text-sm font-medium ${config.iconColor} hover:underline`}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className={`inline-flex ${config.messageColor} hover:${config.titleColor} focus:outline-none`}
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Notification Container
interface NotificationContainerProps {
  notifications: ToastNotification[]
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  position = 'top-right'
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  if (notifications.length === 0) return null

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-4 pointer-events-none`}>
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Notification notification={notification} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}

// Notification Hook for easy usage
let notificationId = 0

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = `notification-${++notificationId}`
    const newNotification: ToastNotification = {
      id,
      duration: 5000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])
    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // Helper methods
  const showSuccess = (title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addNotification({ type: 'success', title, message, ...options })
  }

  const showError = (title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addNotification({ type: 'error', title, message, ...options })
  }

  const showWarning = (title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }

  const showInfo = (title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addNotification({ type: 'info', title, message, ...options })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}