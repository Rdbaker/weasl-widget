const COOKIE_NAME = 'WEASL_AUTH';


export const expireToken = (clientId) => {
  document.cookie = `${COOKIE_NAME}-${clientId}=;expires=${(new Date()).toUTCString()};`;
};