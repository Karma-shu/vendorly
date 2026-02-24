import React from 'react'
import { PushNotificationManager } from '../../components/notifications/PushNotificationManager'

export const NotificationManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
        <p className="text-gray-600">Manage push notifications and campaigns</p>
      </div>
      
      <PushNotificationManager />
    </div>
  )
}