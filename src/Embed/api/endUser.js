import { API_URL } from 'shared/resources';
import { checkStatus } from 'utils/api';


export const EndUserAPI = {
  getMe(token) {
    return fetch(`${API_URL}/widget/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
        'Authorization': `bearer ${token}`,
      },
    })
    .then(checkStatus)
  },

  setAttribute(token, name, value, type) {
    return fetch(`${API_URL}/widget/attributes/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
        'Authorization': `bearer ${token}`,
      },
      body: JSON.stringify({
        value,
        type,
      })
    })
  }
}