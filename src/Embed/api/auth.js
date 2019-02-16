import { API_URL } from 'shared/resources';


export const AuthAPI = {
  sendLoginEmail(email) {
    return fetch(`${API_URL}/widget/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        email
      })
    })
  },

  verifyEmailToken(emailToken) {
    return fetch(`${API_URL}/widget/email/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        token_string: emailToken,
      })
    })
  },

  sendLoginSMS(phoneNumber) {
    return fetch(`${API_URL}/widget/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        phone_number: phoneNumber
      })
    })
  },

  sendVerifySMS(code) {
    return fetch(`${API_URL}/widget/sms/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        token_string: code
      })
    })
  },

  verifyGoogle(token) {
    return fetch(`${API_URL}/widget/google/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        token,
      })
    });
  }
}