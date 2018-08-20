import { API_URL } from 'shared/resources';


export const AuthAPI = {
  sendLoginEmail(email) {
    return fetch(`${API_URL}/end_users/email/send`, {
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

  sendLoginSMS(phoneNumber) {
    return fetch(`${API_URL}/end_users/sms/send`, {
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
    return fetch(`${API_URL}/end_users/sms/verify`, {
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
}