// UI Components
export { Button } from './Button'
export { Input } from './Input'
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card'
export { Modal, ConfirmModal, AlertModal } from './Modal'
export { VoiceSearch } from './VoiceSearch'
export { useEnhancedSearch } from '../../hooks/useEnhancedSearch'
export { BarcodeScanner } from './BarcodeScanner'
export { BarcodeScannerButton } from './BarcodeScannerButton'
export { useBarcodeScanner } from './useBarcodeScanner'
export { LoadingSpinner, LoadingPage, Skeleton, ProductCardSkeleton, VendorCardSkeleton } from './Loading'
export { Badge } from './Badge'
export { Rating } from './Rating'

// Phase 7 Components
export { LoyaltyDashboard } from '../loyalty/LoyaltyDashboard'
export { ChallengeSystem } from '../loyalty/ChallengeSystem'
export { PointsEngine } from '../loyalty/PointsEngine'
export { LanguageSelector, LanguageToggle } from '../i18n/LanguageSelector'
export { InventoryManagement } from '../inventory/InventoryManagement'

// Phase 8 Components
export { PaymentGateway } from '../payment/PaymentGateway'

// Admin Components
export * from '../admin'

// Recommendation Components
export * from '../recommendations'

// Notification Components
export { PushNotificationManager } from '../notifications/PushNotificationManager'