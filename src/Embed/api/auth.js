export const AuthAPI = {
  sendLoginEmail(email) {
    return fetch('http://lcl.noath.co:5000/end_users/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Noath-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        email
      })
    })
  },

  sendLoginSMS(phoneNumber) {
    return fetch('http://lcl.noath.co:5000/end_users/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Noath-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        phone_number: phoneNumber
      })
    })
  },

  sendVerifySMS(code) {
    return fetch('http://lcl.noath.co:5000/end_users/sms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Noath-Client-Id': window.clientId,
      },
      body: JSON.stringify({
        token_string: code
      })
    })
  },

  getMe(token) {
    return fetch('http://lcl.noath.co:5000/end_users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Noath-Client-Id': window.clientId,
        'Authorization': `bearer ${token}`,
      },
    })
  },
}