import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from './Button';
import { useBarcodeScanner } from './useBarcodeScanner';

interface BarcodeScannerButtonProps {
  onScanResult: (barcode: string, type: string) => void
  className?: string
}

export const BarcodeScannerButton: React.FC<BarcodeScannerButtonProps> = ({
  onScanResult,
  className = ''
}) => {
  const { openScanner, handleScanResult } = useBarcodeScanner()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResult = (barcode: string, type: string) => {
    handleScanResult(barcode, type)
    onScanResult(barcode, type)
  }

  return (
    <Button
      onClick={openScanner}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
    >
      <Camera className="w-4 h-4" />
      Scan Barcode
    </Button>
  )
}