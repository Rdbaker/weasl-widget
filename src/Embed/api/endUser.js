import { API_URL } from 'shared/resources';


export const EndUserAPI = {
  getMe(token) {
    return fetch(`${API_URL}/end_users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
        'Authorization': `bearer ${token}`,
      },
    })
  },

  setAttribute(token, name, value) {
    return fetch(`${API_URL}/end_users/attributes/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
        'Authorization': `bearer ${token}`,
      },
      body: JSON.stringify({
        value
      })
    })
  }
}