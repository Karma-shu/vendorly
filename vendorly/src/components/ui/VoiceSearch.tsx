import React, { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Search, Loader, X, Volume2 } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'

// Type definitions for Web Speech API
interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
  start(): void
  stop(): void
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WebkitSpeechRecognitionPlaceholder = null;

interface VoiceSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VoiceRecognitionResultPlaceholder = null;

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onSearch,
  placeholder = "Try saying 'Find biryani near me'",
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [error, setError] = useState<string>('')

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-IN' // Indian English
      recognition.maxAlternatives = 1

      setRecognition(recognition)
      setIsSupported(true)
    } else {
      setIsSupported(false)
      setError('Voice search is not supported in this browser')
    }
  }, [])

  const handleVoiceSearch = useCallback((query: string) => {
    if (query.trim()) {
      onSearch(query.trim())
      setTranscript('')
    }
  }, [onSearch])

  // Set up recognition event handlers
  useEffect(() => {
    if (!recognition) return

    const handleResult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results)
      const latestResult = results[results.length - 1]
      
      if (latestResult) {
        const transcript = latestResult[0].transcript
        const confidence = latestResult[0].confidence
        
        setTranscript(transcript)
        setConfidence(confidence)
        
        // If result is final and confidence is good, trigger search
        if (latestResult.isFinal && confidence > 0.7) {
          handleVoiceSearch(transcript)
        }
      }
    }

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setError(`Voice search error: ${event.error}`)
      setIsListening(false)
    }

    const handleStart = () => {
      setIsListening(true)
      setError('')
      setTranscript('')
    }

    const handleEnd = () => {
      setIsListening(false)
    }

    recognition.onresult = handleResult
    recognition.onerror = handleError
    recognition.onstart = handleStart
    recognition.onend = handleEnd

    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onstart = null
      recognition.onend = null
    }
  }, [recognition, handleVoiceSearch])

  const startListening = useCallback(() => {
    if (!recognition || isListening) return

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      setError('Failed to start voice search')
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (!recognition || !isListening) return

    recognition.stop()
  }, [recognition, isListening])

  const clearTranscript = () => {
    setTranscript('')
    setError('')
  }

  // Text-to-speech for feedback
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-IN'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  if (!isSupported) {
    return (
      <div className={`bg-gray-100 p-3 rounded-lg ${className}`}>
        <p className="text-sm text-gray-600 text-center">
          Voice search is not supported in this browser
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Voice Search Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? 'secondary' : 'outline'}
          className={`flex-1 ${isListening ? 'bg-red-50 border-red-200' : ''}`}
          disabled={!isSupported}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-red-600">Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Voice Search
            </>
          )}
        </Button>

        {transcript && (
          <Button
            onClick={() => speakFeedback(transcript)}
            variant="ghost"
            size="sm"
            title="Repeat what was heard"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Voice Input Status */}
      {isListening && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <Loader className="w-4 h-4 animate-spin text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Listening...</p>
              <p className="text-xs text-blue-700">{placeholder}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Transcript Display */}
      {transcript && (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-900">You said:</p>
                {confidence > 0 && (
                  <Badge 
                    variant={confidence > 0.8 ? 'success' : confidence > 0.6 ? 'warning' : 'error'}
                    size="sm"
                  >
                    {Math.round(confidence * 100)}% confident
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 italic">"{transcript}"</p>
              
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  size="sm" 
                  onClick={() => handleVoiceSearch(transcript)}
                  disabled={!transcript.trim()}
                >
                  <Search className="w-3 h-3 mr-1" />
                  Search
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={clearTranscript}
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="p-3 bg-red-50 border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {/* Voice Search Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Voice search tips:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>"Find biryani restaurants near me"</li>
          <li>"Show me groceries under 100 rupees"</li>
          <li>"Search for Samsung mobile phones"</li>
          <li>"I need medicines for fever"</li>
        </ul>
      </div>
    </div>
  )
}



// Global type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GlobalTypesPlaceholder = null;