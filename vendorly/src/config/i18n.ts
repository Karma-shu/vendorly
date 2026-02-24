import type { Language, CultureConfig } from '../types/i18n'

// Supported languages with cultural information
export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇮🇳',
    direction: 'ltr',
    isActive: true
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    isActive: true
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    direction: 'ltr',
    isActive: true
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    direction: 'ltr',
    isActive: true
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    direction: 'ltr',
    isActive: true
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇮🇳',
    direction: 'rtl',
    isActive: false // RTL support coming soon
  }
]

// Cultural configurations for each language
export const CULTURE_CONFIGS: Record<string, CultureConfig> = {
  en: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'before',
      decimal: '.',
      thousand: ','
    },
    numberFormat: {
      decimal: '.',
      thousand: ','
    },
    phoneFormat: '+91-XXXXX-XXXXX',
    addressFormat: ['line1', 'line2', 'city', 'state', 'pincode', 'country']
  },
  hi: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'before',
      decimal: '.',
      thousand: ','
    },
    numberFormat: {
      decimal: '.',
      thousand: ','
    },
    phoneFormat: '+91-XXXXX-XXXXX',
    addressFormat: ['line1', 'line2', 'city', 'state', 'pincode', 'country']
  },
  ta: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'before',
      decimal: '.',
      thousand: ','
    },
    numberFormat: {
      decimal: '.',
      thousand: ','
    },
    phoneFormat: '+91-XXXXX-XXXXX',
    addressFormat: ['line1', 'line2', 'city', 'state', 'pincode', 'country']
  },
  te: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'before',
      decimal: '.',
      thousand: ','
    },
    numberFormat: {
      decimal: '.',
      thousand: ','
    },
    phoneFormat: '+91-XXXXX-XXXXX',
    addressFormat: ['line1', 'line2', 'city', 'state', 'pincode', 'country']
  },
  bn: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'before',
      decimal: '.',
      thousand: ','
    },
    numberFormat: {
      decimal: '.',
      thousand: ','
    },
    phoneFormat: '+91-XXXXX-XXXXX',
    addressFormat: ['line1', 'line2', 'city', 'state', 'pincode', 'country']
  },
  ur: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'after',
      decimal: '.',
      thousand: ','
    },
    numberFormat: {
      decimal: '.',
      thousand: ','
    },
    phoneFormat: '+91-XXXXX-XXXXX',
    addressFormat: ['country', 'state', 'city', 'line2', 'line1', 'pincode']
  }
}

// Common translations
export const TRANSLATIONS = {
  // Common UI elements
  common: {
    en: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      home: 'Home',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      welcome: 'Welcome',
      language: 'Language',
      selectLanguage: 'Select Language',
      currency: 'Currency',
      location: 'Location',
      notifications: 'Notifications',
      help: 'Help',
      support: 'Support',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      share: 'Share',
      copy: 'Copy',
      view: 'View',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      retry: 'Retry',
      refresh: 'Refresh'
    },
    hi: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      save: 'सेव करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      search: 'खोजें',
      filter: 'फिल्टर',
      sort: 'क्रमबद्ध करें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      home: 'होम',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्स',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
      register: 'रजिस्टर करें',
      welcome: 'स्वागत है',
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें',
      currency: 'मुद्रा',
      location: 'स्थान',
      notifications: 'सूचनाएं',
      help: 'सहायता',
      support: 'सपोर्ट',
      about: 'के बारे में',
      contact: 'संपर्क',
      privacy: 'गोपनीयता',
      terms: 'नियम',
      share: 'साझा करें',
      copy: 'कॉपी करें',
      view: 'देखें',
      close: 'बंद करें',
      open: 'खोलें',
      yes: 'हां',
      no: 'नहीं',
      ok: 'ठीक है',
      retry: 'फिर कोशिश करें',
      refresh: 'रिफ्रेश करें'
    },
    ta: {
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      cancel: 'ரத்து',
      confirm: 'உறுதிப்படுத்து',
      save: 'சேமி',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      search: 'தேடு',
      filter: 'வடிகட்டி',
      sort: 'வரிசைப்படுத்து',
      back: 'பின்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      home: 'முகப்பு',
      profile: 'சுயவிவரம்',
      settings: 'அமைப்புகள்',
      logout: 'வெளியேறு',
      login: 'உள்நுழை',
      register: 'பதிவு',
      welcome: 'வரவேற்கிறோம்',
      language: 'மொழி',
      selectLanguage: 'மொழியைத் தேர்ந்தெடு',
      currency: 'நாணயம்',
      location: 'இடம்',
      notifications: 'அறிவிப்புகள்',
      help: 'உதவி',
      support: 'ஆதரவு',
      about: 'பற்றி',
      contact: 'தொடர்பு',
      privacy: 'தனியுரிமை',
      terms: 'விதிமுறைகள்',
      share: 'பகிர்',
      copy: 'நகலெடு',
      view: 'பார்',
      close: 'மூடு',
      open: 'திற',
      yes: 'ஆம்',
      no: 'இல்லை',
      ok: 'சரி',
      retry: 'மீண்டும் முயற்சி',
      refresh: 'புதுப்பி'
    },
    te: {
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      cancel: 'రద్దు',
      confirm: 'నిర్ధారించు',
      save: 'సేవ్',
      edit: 'సవరించు',
      delete: 'తొలగించు',
      search: 'వెతకు',
      filter: 'ఫిల్టర్',
      sort: 'క్రమపరచు',
      back: 'వెనుక',
      next: 'తదుపరి',
      previous: 'మునుపటి',
      home: 'హోమ్',
      profile: 'ప్రొఫైల్',
      settings: 'సెట్టింగ్స్',
      logout: 'లాగౌట్',
      login: 'లాగిన్',
      register: 'రిజిస్టర్',
      welcome: 'స్వాగతం',
      language: 'భాష',
      selectLanguage: 'భాషను ఎంచుకోండి',
      currency: 'కరెన్సీ',
      location: 'స్థానం',
      notifications: 'నోటిఫికేషన్స్',
      help: 'సహాయం',
      support: 'మద్దతు',
      about: 'గురించి',
      contact: 'సంప్రదింపు',
      privacy: 'గోప్యత',
      terms: 'నిబంధనలు',
      share: 'షేర్',
      copy: 'కాపీ',
      view: 'చూడు',
      close: 'మూసివేయి',
      open: 'తెరువు',
      yes: 'అవును',
      no: 'లేదు',
      ok: 'సరే',
      retry: 'మళ్లీ ప్రయత్నించు',
      refresh: 'రిఫ్రెష్'
    },
    bn: {
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফল',
      cancel: 'বাতিল',
      confirm: 'নিশ্চিত',
      save: 'সেভ',
      edit: 'সম্পাদনা',
      delete: 'মুছে ফেলুন',
      search: 'অনুসন্ধান',
      filter: 'ফিল্টার',
      sort: 'সাজান',
      back: 'পিছনে',
      next: 'পরবর্তী',
      previous: 'আগের',
      home: 'হোম',
      profile: 'প্রোফাইল',
      settings: 'সেটিংস',
      logout: 'লগআউট',
      login: 'লগইন',
      register: 'নিবন্ধন',
      welcome: 'স্বাগতম',
      language: 'ভাষা',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      currency: 'মুদ্রা',
      location: 'অবস্থান',
      notifications: 'বিজ্ঞপ্তি',
      help: 'সাহায্য',
      support: 'সহায়তা',
      about: 'সম্পর্কে',
      contact: 'যোগাযোগ',
      privacy: 'গোপনীয়তা',
      terms: 'শর্তাবলী',
      share: 'শেয়ার',
      copy: 'কপি',
      view: 'দেখুন',
      close: 'বন্ধ',
      open: 'খুলুন',
      yes: 'হ্যাঁ',
      no: 'না',
      ok: 'ঠিক আছে',
      retry: 'আবার চেষ্টা',
      refresh: 'রিফ্রেশ'
    }
  },

  // Authentication
  auth: {
    en: {
      welcomeTitle: 'Welcome to Vendorly',
      welcomeSubtitle: 'Your hyperlocal quick commerce platform',
      phoneNumber: 'Phone Number',
      enterPhone: 'Enter your phone number',
      sendOTP: 'Send OTP',
      verifyOTP: 'Verify OTP',
      enterOTP: 'Enter OTP sent to',
      resendOTP: 'Resend OTP',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      createAccount: 'Create Account',
      selectUserType: 'I want to',
      orderFood: 'Order Food & Groceries',
      sellProducts: 'Sell Products',
      customer: 'Customer',
      vendor: 'Vendor',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signIn: 'Sign In',
      signUp: 'Sign Up',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      termsAgree: 'I agree to the Terms & Conditions',
      privacyAgree: 'I agree to the Privacy Policy'
    },
    hi: {
      welcomeTitle: 'वेंडरली में आपका स्वागत है',
      welcomeSubtitle: 'आपका हाइपरलोकल क्विक कॉमर्स प्लेटफॉर्म',
      phoneNumber: 'फोन नंबर',
      enterPhone: 'अपना फोन नंबर दर्ज करें',
      sendOTP: 'OTP भेजें',
      verifyOTP: 'OTP सत्यापित करें',
      enterOTP: 'भेजा गया OTP दर्ज करें',
      resendOTP: 'OTP दोबारा भेजें',
      firstName: 'नाम',
      lastName: 'उपनाम',
      email: 'ईमेल',
      createAccount: 'खाता बनाएं',
      selectUserType: 'मैं चाहता हूं',
      orderFood: 'खाना और सामान ऑर्डर करना',
      sellProducts: 'उत्पाद बेचना',
      customer: 'ग्राहक',
      vendor: 'विक्रेता',
      alreadyHaveAccount: 'पहले से खाता है?',
      dontHaveAccount: 'खाता नहीं है?',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      forgotPassword: 'पासवर्ड भूल गए?',
      resetPassword: 'पासवर्ड रीसेट करें',
      newPassword: 'नया पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      termsAgree: 'मैं नियम और शर्तों से सहमत हूं',
      privacyAgree: 'मैं गोपनीयता नीति से सहमत हूं'
    }
  },

  // Products and Shopping
  products: {
    en: {
      categories: 'Categories',
      allCategories: 'All Categories',
      trending: 'Trending',
      newArrivals: 'New Arrivals',
      onSale: 'On Sale',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      quantity: 'Quantity',
      price: 'Price',
      discount: 'Discount',
      originalPrice: 'Original Price',
      salePrice: 'Sale Price',
      reviews: 'Reviews',
      rating: 'Rating',
      description: 'Description',
      specifications: 'Specifications',
      similarProducts: 'Similar Products',
      recentlyViewed: 'Recently Viewed',
      recommended: 'Recommended for You',
      cart: 'Cart',
      cartEmpty: 'Your cart is empty',
      checkout: 'Checkout',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Tax',
      shipping: 'Shipping',
      freeShipping: 'Free Shipping',
      deliveryFee: 'Delivery Fee'
    },
    hi: {
      categories: 'श्रेणियां',
      allCategories: 'सभी श्रेणियां',
      trending: 'ट्रेंडिंग',
      newArrivals: 'नए उत्पाद',
      onSale: 'सेल में',
      outOfStock: 'स्टॉक में नहीं',
      inStock: 'स्टॉक में',
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'अभी खरीदें',
      quantity: 'मात्रा',
      price: 'कीमत',
      discount: 'छूट',
      originalPrice: 'मूल कीमत',
      salePrice: 'सेल कीमत',
      reviews: 'समीक्षाएं',
      rating: 'रेटिंग',
      description: 'विवरण',
      specifications: 'विशेषताएं',
      similarProducts: 'समान उत्पाद',
      recentlyViewed: 'हाल ही में देखे गए',
      recommended: 'आपके लिए सुझाए गए',
      cart: 'कार्ट',
      cartEmpty: 'आपका कार्ट खाली है',
      checkout: 'चेकआउट',
      total: 'कुल',
      subtotal: 'उप-योग',
      tax: 'कर',
      shipping: 'शिपिंग',
      freeShipping: 'मुफ्त शिपिंग',
      deliveryFee: 'डिलीवरी शुल्क'
    }
  },

  // Orders
  orders: {
    en: {
      myOrders: 'My Orders',
      orderHistory: 'Order History',
      orderDetails: 'Order Details',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      orderStatus: 'Order Status',
      trackOrder: 'Track Order',
      orderPlaced: 'Order Placed',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      outForDelivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
      estimatedDelivery: 'Estimated Delivery',
      deliveryAddress: 'Delivery Address',
      paymentMethod: 'Payment Method',
      orderSummary: 'Order Summary',
      items: 'Items',
      reorder: 'Reorder',
      cancelOrder: 'Cancel Order',
      returnOrder: 'Return Order',
      rateOrder: 'Rate Order',
      writeReview: 'Write Review'
    },
    hi: {
      myOrders: 'मेरे ऑर्डर',
      orderHistory: 'ऑर्डर इतिहास',
      orderDetails: 'ऑर्डर विवरण',
      orderNumber: 'ऑर्डर नंबर',
      orderDate: 'ऑर्डर की तारीख',
      orderStatus: 'ऑर्डर स्थिति',
      trackOrder: 'ऑर्डर ट्रैक करें',
      orderPlaced: 'ऑर्डर दिया गया',
      confirmed: 'पुष्ट',
      preparing: 'तैयार हो रहा है',
      outForDelivery: 'डिलीवरी के लिए निकला',
      delivered: 'डिलीवर हो गया',
      cancelled: 'रद्द',
      refunded: 'रिफंड',
      estimatedDelivery: 'अनुमानित डिलीवरी',
      deliveryAddress: 'डिलीवरी पता',
      paymentMethod: 'भुगतान विधि',
      orderSummary: 'ऑर्डर सारांश',
      items: 'आइटम',
      reorder: 'दोबारा ऑर्डर करें',
      cancelOrder: 'ऑर्डर रद्द करें',
      returnOrder: 'ऑर्डर वापस करें',
      rateOrder: 'ऑर्डर रेट करें',
      writeReview: 'समीक्षा लिखें'
    }
  }
}

// Helper functions
export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

export const getActiveLanguages = (): Language[] => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.isActive)
}

export const getCultureConfig = (languageCode: string): CultureConfig => {
  return CULTURE_CONFIGS[languageCode] || CULTURE_CONFIGS.en
}

export const formatCurrency = (amount: number, languageCode: string): string => {
  const config = getCultureConfig(languageCode)
  const formattedAmount = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
  
  return config.currency.position === 'before' 
    ? `${config.currency.symbol}${formattedAmount}`
    : `${formattedAmount} ${config.currency.symbol}`
}

export const formatDate = (date: Date, languageCode: string): string => {
  const config = getCultureConfig(languageCode)
  
  // Simple date formatting - in production, use a proper date library
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return config.dateFormat
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString())
}

export const formatPhoneNumber = (phone: string, languageCode: string): string => {
  const config = getCultureConfig(languageCode)
  // Simple phone formatting - in production, use proper phone number library
  return phone.replace(/(\+91)(\d{5})(\d{5})/, '$1-$2-$3')
}