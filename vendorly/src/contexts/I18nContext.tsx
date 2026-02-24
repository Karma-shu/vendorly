import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../types/i18n'
import { SUPPORTED_LANGUAGES, TRANSLATIONS, getLanguageByCode, getCultureConfig, formatCurrency, formatDate } from '../config/i18n'

interface I18nContextType {
  currentLanguage: Language
  languages: Language[]
  translations: Record<string, Record<string, string>>
  changeLanguage: (languageCode: string) => void
  t: (namespace: string, key: string, fallback?: string) => string
  formatCurrency: (amount: number) => string
  formatDate: (date: Date) => string
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  defaultLanguage?: string
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('vendorly-language')
    if (savedLanguage) {
      const lang = getLanguageByCode(savedLanguage)
      if (lang) return lang
    }
    
    // Try to detect browser language
    const browserLanguage = navigator.language.split('-')[0]
    const detectedLang = getLanguageByCode(browserLanguage)
    if (detectedLang && detectedLang.isActive) return detectedLang
    
    // Fallback to default
    return getLanguageByCode(defaultLanguage) || SUPPORTED_LANGUAGES[0]
  })

  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    // Load translations for current language
    const loadTranslations = () => {
      const langTranslations: Record<string, Record<string, string>> = {}
      
      Object.keys(TRANSLATIONS).forEach(namespace => {
        const namespaceTranslations = TRANSLATIONS[namespace as keyof typeof TRANSLATIONS]
        langTranslations[namespace] = namespaceTranslations[currentLanguage.code as keyof typeof namespaceTranslations] || {}
      })
      
      setTranslations(langTranslations)
    }

    loadTranslations()
    
    // Update document direction
    document.documentElement.dir = currentLanguage.direction
    document.documentElement.lang = currentLanguage.code
    
    // Save to localStorage
    localStorage.setItem('vendorly-language', currentLanguage.code)
  }, [currentLanguage])

  const changeLanguage = (languageCode: string) => {
    const newLanguage = getLanguageByCode(languageCode)
    if (newLanguage && newLanguage.isActive) {
      setCurrentLanguage(newLanguage)
    }
  }

  const t = (namespace: string, key: string, fallback?: string): string => {
    const namespaceTranslations = translations[namespace] || {}
    const translation = namespaceTranslations[key]
    
    if (translation) return translation
    
    // Fallback to English if translation not found
    if (currentLanguage.code !== 'en') {
      const englishTranslations = TRANSLATIONS[namespace as keyof typeof TRANSLATIONS]?.en as Record<string, string> || {}
      const englishTranslation = englishTranslations[key]
      if (englishTranslation) return englishTranslation
    }
    
    // Return fallback or key
    return fallback || key
  }

  const formatCurrencyWithContext = (amount: number): string => {
    return formatCurrency(amount, currentLanguage.code)
  }

  const formatDateWithContext = (date: Date): string => {
    return formatDate(date, currentLanguage.code)
  }

  const value: I18nContextType = {
    currentLanguage,
    languages: SUPPORTED_LANGUAGES.filter(lang => lang.isActive),
    translations,
    changeLanguage,
    t,
    formatCurrency: formatCurrencyWithContext,
    formatDate: formatDateWithContext,
    isRTL: currentLanguage.direction === 'rtl'
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Hook for common translations
export const useTranslation = (namespace: string = 'common') => {
  const { t } = useI18n()
  
  return {
    t: (key: string, fallback?: string) => t(namespace, key, fallback)
  }
}