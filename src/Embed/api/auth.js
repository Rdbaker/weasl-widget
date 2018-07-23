export const AuthAPI = {
  sendLoginEmail(email) {
    return fetch('http://localhost:9000/auth/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email
      })
    })
  },

  sendLoginSMS(phoneNumber) {
    return fetch('http://localhost:9000/auth/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber
      })
    })
  },

  sendVerifySMS(code) {
    return fetch('http://localhost:9000/auth/sms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token_string: code
      })
    })
  },
}