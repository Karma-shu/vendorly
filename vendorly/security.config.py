# Security Configuration for Vendorly
# This file contains security headers, CSP, and other security configurations

# Content Security Policy
CSP_POLICY = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",  # Required for Vite in development
    "'unsafe-eval'",    # Required for development tools
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://api.vendorly.in",
    "https://generativelanguage.googleapis.com"
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",  # Required for Tailwind CSS
    "https://fonts.googleapis.com"
  ],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://api.vendorly.in",
    "https://res.cloudinary.com",
    "https://images.unsplash.com",
    "https://via.placeholder.com"
  ],
  "font-src": [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  "connect-src": [
    "'self'",
    "https://api.vendorly.in",
    "https://generativelanguage.googleapis.com",
    "https://api.razorpay.com",
    "https://checkout.razorpay.com",
    "https://www.google-analytics.com",
    "https://sentry.io",
    "wss://api.vendorly.in"
  ],
  "media-src": ["'self'", "blob:", "data:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": []
}

# Security Headers
SECURITY_HEADERS = {
  # Prevent clickjacking
  "X-Frame-Options": "DENY",
  
  # Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  
  # XSS Protection
  "X-XSS-Protection": "1; mode=block",
  
  # Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",
  
  # Permissions Policy (Feature Policy)
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), payment=(self)",
  
  # HSTS (HTTP Strict Transport Security)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  
  # Cross-Origin Resource Policy
  "Cross-Origin-Resource-Policy": "same-origin",
  
  # Cross-Origin Embedder Policy
  "Cross-Origin-Embedder-Policy": "require-corp",
  
  # Cross-Origin Opener Policy
  "Cross-Origin-Opener-Policy": "same-origin"
}

# Environment-specific configurations
DEVELOPMENT_OVERRIDES = {
  "CSP_POLICY": {
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "http://localhost:*",
      "ws://localhost:*",
      "https://www.googletagmanager.com"
    ],
    "connect-src": [
      "'self'",
      "http://localhost:*",
      "ws://localhost:*",
      "https://api.vendorly.in",
      "https://generativelanguage.googleapis.com"
    ]
  }
}

STAGING_OVERRIDES = {
  "SECURITY_HEADERS": {
    "Strict-Transport-Security": "max-age=86400; includeSubDomains"  # Shorter for staging
  }
}

# Rate limiting configuration
RATE_LIMITS = {
  "api": {
    "window": "15min",
    "max": 100
  },
  "auth": {
    "window": "15min", 
    "max": 5
  },
  "upload": {
    "window": "1hour",
    "max": 20
  }
}

# Input validation rules
VALIDATION_RULES = {
  "email": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
  "phone": r"^[6-9]\d{9}$",  # Indian mobile numbers
  "password": {
    "min_length": 8,
    "require_uppercase": True,
    "require_lowercase": True,
    "require_numbers": True,
    "require_special": False
  },
  "business_name": r"^[a-zA-Z0-9\s\-\.]{2,50}$",
  "product_name": r"^[a-zA-Z0-9\s\-\.\/]{2,100}$"
}

# File upload restrictions
UPLOAD_RESTRICTIONS = {
  "max_file_size": "5MB",
  "allowed_types": [
    "image/jpeg",
    "image/png", 
    "image/webp",
    "image/svg+xml"
  ],
  "max_files_per_upload": 5,
  "virus_scan": True,
  "image_processing": {
    "max_width": 2048,
    "max_height": 2048,
    "quality": 85,
    "format": "webp"
  }
}

# Authentication security
AUTH_SECURITY = {
  "jwt": {
    "algorithm": "RS256",
    "expiry": "24h",
    "refresh_expiry": "7d",
    "issuer": "vendorly.in",
    "audience": "vendorly-app"
  },
  "session": {
    "secure": True,
    "http_only": True,
    "same_site": "strict",
    "max_age": 86400  # 24 hours
  },
  "password_policy": {
    "min_length": 8,
    "max_attempts": 5,
    "lockout_duration": "15min",
    "require_2fa": False  # Future enhancement
  },
  "otp": {
    "length": 6,
    "expiry": "10min",
    "max_attempts": 3,
    "resend_limit": 3
  }
}

# API security
API_SECURITY = {
  "cors": {
    "origins": [
      "https://vendorly.in",
      "https://www.vendorly.in", 
      "https://staging.vendorly.in"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
    "headers": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-CSRF-Token"
    ],
    "credentials": True
  },
  "csrf": {
    "enabled": True,
    "header_name": "X-CSRF-Token",
    "cookie_name": "csrf_token"
  },
  "api_keys": {
    "header_name": "X-API-Key",
    "rate_limit": {
      "window": "1hour",
      "max": 1000
    }
  }
}

# Data protection
DATA_PROTECTION = {
  "encryption": {
    "algorithm": "AES-256-GCM",
    "key_rotation": "90days"
  },
  "pii_fields": [
    "email",
    "phone", 
    "address",
    "full_name",
    "bank_details"
  ],
  "data_retention": {
    "user_data": "3years",
    "transaction_data": "7years",
    "logs": "90days",
    "analytics": "2years"
  },
  "gdpr_compliance": {
    "right_to_be_forgotten": True,
    "data_portability": True,
    "consent_management": True
  }
}

# Monitoring and alerting
SECURITY_MONITORING = {
  "failed_login_threshold": 10,
  "suspicious_activity_indicators": [
    "multiple_failed_logins",
    "unusual_location",
    "large_order_values",
    "rapid_api_calls"
  ],
  "alert_channels": [
    "email",
    "slack",
    "sentry"
  ],
  "log_retention": "90days",
  "audit_log_events": [
    "login",
    "logout", 
    "password_change",
    "profile_update",
    "payment_transaction",
    "admin_action"
  ]
}

# Third-party integrations security
THIRD_PARTY_SECURITY = {
  "payment_gateway": {
    "webhook_verification": True,
    "encryption": "TLS 1.2+",
    "pci_compliance": True
  },
  "ai_services": {
    "data_sharing": "minimal",
    "encryption_in_transit": True,
    "no_personal_data": True
  },
  "analytics": {
    "anonymization": True,
    "ip_masking": True,
    "gdpr_compliant": True
  }
}