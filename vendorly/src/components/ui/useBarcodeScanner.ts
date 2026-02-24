import { useState } from 'react';

// Hook for barcode scanning integration
export const useBarcodeScanner = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [lastScanResult, setLastScanResult] = useState<{ barcode: string; type: string } | null>(null)

  const openScanner = () => setIsOpen(true)
  const closeScanner = () => setIsOpen(false)

  const handleScanResult = (barcode: string, type: string) => {
    setLastScanResult({ barcode, type })
    
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'barcode_scan', {
        barcode_type: type,
        scan_success: true
      })
    }
    
    closeScanner()
  }

  return {
    isOpen,
    lastScanResult,
    openScanner,
    closeScanner,
    handleScanResult
  }
}