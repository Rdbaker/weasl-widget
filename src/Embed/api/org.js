import { API_URL } from 'shared/resources';


export const OrgAPI = {
  getPublicOrg() {
    return fetch(`${API_URL}/widget/org`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Weasl-Client-Id': window.clientId,
      },
    })
  },
}