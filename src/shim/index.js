import * as EventTypes from 'shared/eventTypes';
import { UnmountedError } from 'shared/errors';
import { IFRAME_URL } from 'shared/resources';

import './style.css';


const WEASL_WRAPPER_ID = 'weasl-container';
const IFRAME_ID = 'weasl-iframe-element';
const TAKEOVER_CLASSNAME = 'weasl-iframe-takeover';


class Weasl {

  // PUBLIC API

  init = (clientId) => {
    this.clientId = clientId;
    this.initializeIframe();
    this.mountIframe();
  }

  login = () => {
    this.ensureMounted()
    this.flowPromise = new Promise(() => {});
    this.iframe.classList.add(TAKEOVER_CLASSNAME);
    this.startFlow();
    return this.flowPromise;
  }

  register = () => {
    this.ensureMounted()
    // TODO: logic
    worked = Math.random() > 0.3

    return new Promise((res, rej) => setTimeout(worked ? res : rej, 1200, {id: 1234}))
  }

  getCurrentUser = () => {
    this.ensureMounted()
    const getUserPromise = new Promise((res, rej) => {
      this.onSuccessfulCurrentUserFetch = res
      this.onFailedCurrentUserFetch = rej
    });
    this.iframe.contentWindow.postMessage({type: EventTypes.GET_CURRENT_USER_VIA_JWT, value: this.getCookie()}, '*');
    return getUserPromise;
  }

  debug = () => {
    this.debug = !this.debug
    console.info(`[weasl] debug mode ${this.debug ? 'enabled' : 'disabled'}`)
  }

  // PRIVATE METHODS

  ensureMounted = () => {
    if (!document.getElementById(IFRAME_ID)) {
      throw new UnmountedError('weasl.init needs to be called first')
    }
  }

  receiveMessage = (event) => {
    if(!!event && !!event.data && !!event.data.type) {
      switch(event.data.type) {
        case EventTypes.SET_COOKIE:
          document.cookie = event.data.value;
          break;
        case EventTypes.FETCH_CURRENT_USER_SUCCESS:
          this.onSuccessfulCurrentUserFetch(event.data.value);
          break;
      }
    }
  }

  getCookie = () => {
    const startIndex = document.cookie.indexOf(`WEASL_AUTH-${this.clientId}`);
    if (startIndex === -1) {
      return null;
    }
    const startSlice = startIndex + 22;
    const endIndex = document.cookie.slice(startIndex).indexOf(';');
    if (endIndex === -1) {
      return document.cookie.slice(startSlice);
    } else {
      return document.cookie.slice(startSlice, startIndex + endIndex);
    }
  }

  initializeIframe = () => {
    if (!document.getElementById(IFRAME_ID)) {
      const iframe = document.createElement('iframe')
      iframe.onload = () => this.iframe.contentWindow.postMessage({ type: EventTypes.INIT_IFRAME, value: this.clientId}, '*')
      iframe.src = IFRAME_URL
      iframe.id = IFRAME_ID
      iframe.crossorigin = "anonymous"
      this.iframe = iframe
    }
  }

  mountIframe = () => {
    if (!document.getElementById(IFRAME_ID)) {
      window.addEventListener("message", this.receiveMessage, false);
      const wrapper = document.createElement('div')
      wrapper.id = WEASL_WRAPPER_ID
      wrapper.style = `z-index: ${Number.MAX_SAFE_INTEGER}; width: 0; height: 0`
      wrapper.appendChild(this.iframe)
      document.body.appendChild(wrapper)
    }
  }

  startFlow = () => {
    this.iframe.contentWindow.postMessage('START_FLOW', '*')
    window.addEventListener("message", console.log, false);
  }
}


export default ((window) => {
  // TODO: keep track of prior method calls
  const weasl = new Weasl()

  const weaslApi = () => {}

  weaslApi.init = weasl.init

  // maybe these can all be the same function?
  weaslApi.login = weasl.login
  weaslApi.register = weasl.register
  weaslApi.getCurrentUser = weasl.getCurrentUser

  window.weasl = weaslApi
})(global)