let ResourcesConstants;

if (ENVIRONMENT === 'production') {
  ResourcesConstants = {
    API_URL: 'https://api.weasl.in',
    IFRAME_URL: 'https://js.weasl.in/embed/index.html',
    WWW_URL: 'https://www.weasl.in',
    APP_URL: 'https://app.weasl.in',
    SENTRY_DSN: 'https://8f674449bb7646468c3f434826aed6b2@sentry.io/1828539',
  }
} else {
  ResourcesConstants = {
    API_URL: 'http://lcl.weasl.in:5000',
    IFRAME_URL: 'http://lcl.weasl.in:9001/index-embed.html',
    WWW_URL: 'https://lcl.weasl.in:5000',
    APP_URL: 'http://localhost:3000',
    SENTRY_DSN: '',
  }
}

export const DEBUG = ENVIRONMENT !== 'production'
export const API_URL = ResourcesConstants.API_URL
export const IFRAME_URL = ResourcesConstants.IFRAME_URL
export const APP_URL = ResourcesConstants.APP_URL
export const WWW_URL = ResourcesConstants.WWW_URL
export const SENTRY_DSN = ResourcesConstants.SENTRY_DSN