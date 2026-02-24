import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, Flashlight, FlashlightOff, RotateCcw, CheckCircle } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'

// Extended type definitions for torch capability
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExtendedConstraintSetPlaceholder = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExtendedMediaTrackConstraintSetPlaceholder = {};

interface BarcodeScannerProps {
  onScanResult: (barcode: string, type: string) => void
  onClose: () => void
  className?: string
}

interface ScanResult {
  text: string
  type: string
  timestamp: number
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanResult,
  onClose,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>('')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsScanning(true)
        setError('')

        // Check for flash capability
        const videoTrack = stream.getVideoTracks()[0]
        const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & { torch?: boolean }
        setHasFlash(!!capabilities.torch)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Unable to access camera. Please check permissions.')
    }
  }, [facingMode])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
    setFlashOn(false)
  }, [])

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (!streamRef.current || !hasFlash) return

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      await videoTrack.applyConstraints({
        advanced: [{ torch: !flashOn } as MediaTrackConstraintSet & { torch?: boolean }]
      })
      setFlashOn(!flashOn)
    } catch (err) {
      console.error('Flash toggle error:', err)
    }
  }, [flashOn, hasFlash])

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  // Simulated barcode detection (in real app, use QuaggaJS or ZXing)
  const detectBarcode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Simulate barcode detection (replace with actual detection library)
    // This is a mock implementation for demonstration
    const mockDetection = Math.random() < 0.02 // 2% chance per frame

    if (mockDetection) {
      const mockBarcodes = [
        { text: '8901030875648', type: 'EAN-13' },
        { text: '1234567890128', type: 'UPC-A' },
        { text: '9780134685991', type: 'ISBN' },
        { text: 'ABCD-1234-EFGH', type: 'Code128' }
      ]
      
      const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
      
      const result: ScanResult = {
        ...randomBarcode,
        timestamp: Date.now()
      }
      
      setScanResult(result)
      setIsScanning(false)
      
      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(200)
      }
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onScanResult(result.text, result.type)
        onClose()
      }, 2000)
    }
  }, [isScanning, onScanResult, onClose])

  // Start scanning animation loop
  useEffect(() => {
    if (!isScanning) return

    const intervalId = setInterval(detectBarcode, 100) // Check every 100ms

    return () => clearInterval(intervalId)
  }, [isScanning, detectBarcode])

  // Initialize camera on mount
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  // Update camera when facing mode changes
  useEffect(() => {
    if (isScanning) {
      startCamera()
    }
  }, [facingMode, startCamera, isScanning])

  return (
    <div className={`fixed inset-0 z-50 bg-black ${className}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">Scan Barcode</h3>
            <p className="text-sm opacity-80">
              Point camera at product barcode
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* Hidden canvas for frame processing */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Scanning Frame */}
              <div className="w-64 h-64 border-2 border-white border-opacity-50 relative">
                {/* Corner indicators */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>
                
                {/* Scanning Line Animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-0.5 bg-green-400 shadow-lg animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
                </div>
              </div>
              
              <p className="text-white text-center mt-4 text-sm">
                Position barcode within the frame
              </p>
            </div>
          </div>
        )}

        {/* Success Result */}
        {scanResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <Card className="p-6 m-4 max-w-sm">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Barcode Detected!</h3>
                
                <div className="space-y-2">
                  <div>
                    <Badge variant="success" size="sm">
                      {scanResult.type}
                    </Badge>
                  </div>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {scanResult.text}
                  </p>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Searching for product...
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
        <div className="flex items-center justify-center gap-4">
          {/* Flash Toggle */}
          {hasFlash && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFlash}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              {flashOn ? (
                <FlashlightOff className="w-5 h-5" />
              ) : (
                <Flashlight className="w-5 h-5" />
              )}
            </Button>
          )}

          {/* Camera Switch */}
          <Button
            variant="ghost"
            size="sm"
            onClick={switchCamera}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          {/* Manual Input Fallback */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const barcode = prompt('Enter barcode manually:')
              if (barcode) {
                onScanResult(barcode, 'Manual')
                onClose()
              }
            }}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-20 left-4 right-4">
          <Card className="p-3 bg-red-50 border-red-200">
            <p className="text-sm text-red-700 text-center">{error}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={startCamera}
              className="w-full mt-2"
            >
              Retry Camera Access
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

// Barcode Scanner Button Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BarcodeScannerButtonProps {
  onScanResult: (barcode: string, type: string) => void
  className?: string
}

