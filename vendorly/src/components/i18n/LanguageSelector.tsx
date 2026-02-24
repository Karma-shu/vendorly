import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui'
import { useI18n, useTranslation } from '../../contexts/I18nContext'
import { Languages, Globe, Check } from 'lucide-react'

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, languages, changeLanguage } = useI18n()
  const { t } = useTranslation('common')

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          {t('selectLanguage', 'Select Language')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full p-4 border rounded-lg flex items-center justify-between transition-all ${
              currentLanguage.code === language.code
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <p className="font-medium">{language.nativeName}</p>
                <p className="text-sm text-gray-500">{language.name}</p>
              </div>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="w-5 h-5" />
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

interface LanguageToggleProps {
  compact?: boolean
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ compact = false }) => {
  const { currentLanguage, languages, changeLanguage } = useI18n()
  const [isOpen, setIsOpen] = React.useState(false)

  if (compact) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 min-w-48 bg-white border rounded-lg shadow-lg">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLanguage(language.code)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  currentLanguage.code === language.code ? 'bg-primary/5 text-primary' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div>
                  <p className="font-medium text-sm">{language.nativeName}</p>
                  <p className="text-xs text-gray-500">{language.name}</p>
                </div>
                {currentLanguage.code === language.code && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return <LanguageSelector />
}