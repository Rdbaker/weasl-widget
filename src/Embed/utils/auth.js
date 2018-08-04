import * as EventTypes from 'shared/eventTypes';


const COOKIE_NAME = 'WEASL_AUTH';


// locally, you should be running apps under lcl.partnr.org
export const setToken = (token) => {
  const cookie = `${COOKIE_NAME}-${window.clientId}=${token}`;
  window.top.postMessage({ type: EventTypes.SET_COOKIE, value: cookie }, '*');
  document.cookie = cookie;
};

export const getToken = () => {
  const startIndex = document.cookie.indexOf(COOKIE_NAME);
  if (startIndex === -1) {
    return null;
  }
  const startSlice = startIndex + COOKIE_NAME.length + 1;
  const endIndex = document.cookie.slice(startIndex).indexOf(';');
  if (endIndex === -1) {
    return document.cookie.slice(startSlice);
  } else {
    return document.cookie.slice(startSlice, startIndex + endIndex);
  }
}