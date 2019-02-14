import * as EventTypes from 'shared/eventTypes';


const COOKIE_NAME = 'WEASL_AUTH';


// locally, you should be running apps under lcl.weasl.in
export const setToken = (token, domain) => {
  // TODO: this should be configurable via settings
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 7);

  const cookie = `${COOKIE_NAME}-${window.clientId}=${token};expires=${expireDate.toUTCString()};Domain=${domain};`;
  window.top.postMessage({ type: EventTypes.SET_COOKIE, value: cookie }, '*');
};

// TODO: move this to a more central place, maybe an epic
export const finishFlow = () => {
  window.top.postMessage({ type: EventTypes.FINISH_FLOW }, '*');
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