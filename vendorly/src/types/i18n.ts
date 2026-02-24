// i18n configuration types
export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
  isActive: boolean
}

export interface TranslationKey {
  key: string
  en: string
  hi?: string
  ta?: string
  te?: string
  bn?: string
  ur?: string
}

export interface TranslationNamespace {
  common: Record<string, string>
  auth: Record<string, string>
  dashboard: Record<string, string>
  products: Record<string, string>
  orders: Record<string, string>
  profile: Record<string, string>
  vendor: Record<string, string>
  loyalty: Record<string, string>
  notifications: Record<string, string>
  errors: Record<string, string>
}

export interface CultureConfig {
  dateFormat: string
  timeFormat: string
  currency: {
    code: string
    symbol: string
    position: 'before' | 'after'
    decimal: string
    thousand: string
  }
  numberFormat: {
    decimal: string
    thousand: string
  }
  phoneFormat: string
  addressFormat: string[]
}