let ResourcesConstants;

if (ENVIRONMENT === 'production') {
  ResourcesConstants = {
    API_URL: 'https://api.weasl.in',
    IFRAME_URL: 'https://js.weasl.in/embed/index.html',
  }
} else {
  ResourcesConstants = {
    API_URL: 'http://lcl.weasl.in:5000',
    IFRAME_URL: 'http://lcl.weasl.in:9001/index-embed.html',
  }
}

export const DEBUG = ENVIRONMENT !== 'production'
export const API_URL = ResourcesConstants.API_URL
export const IFRAME_URL = ResourcesConstants.IFRAME_URL