const NOATH_WRAPPER_ID = 'weasl-container'
const IFRAME_ID = 'weasl-iframe-element'
const TAKEOVER_CLASSNAME = 'weasl-iframe-takeover'
const IFRAME_URL = ENVIRONMENT === 'production' ? 'https://js.weasl.in/index.html' : 'http://lcl.weasl.in:9001/index-embed.html'

import './style.css'


class Weasl {

  // PUBLIC API

  init = (clientId) => {
    this.clientId = clientId
    this.initializeIframe()
    this.mountIframe()
  }

  login = () => {
    this.flowPromise = new Promise(() => {})
    this.iframe.classList.add(TAKEOVER_CLASSNAME)
    this.startFlow()
    window.addEventListener("message", this.receiveMessage, false);
    return this.flowPromise
  }

  register = () => {
    // TODO: logic
    worked = Math.random() > 0.3

    return new Promise((res, rej) => setTimeout(worked ? res : rej, 1200, {id: 1234}))
  }

  getCurrentUser = () => {
    this.getUserPromise = new Promise(() => {});
    console.log('about to post message with the cookie');
    this.iframe.contentWindow.postMessage({type: 'GET_USER_VIA_JWT', value: this.getCookie()}, '*');
    return this.getUserPromise;
  }

  debug = () => {
    this.debug = !this.debug
    console.info(`[weasl] debug mode ${this.debug ? 'enabled' : 'disabled'}`)
  }

  // PRIVATE METHODS

  receiveMessage = (event) => {
    console.log('about to check the event for data')
    if(!!event && !!event.data && !!event.data.type) {
      console.log('about to switch on event.data.type', event.data)
      switch(event.data.type) {
        case 'setCookie':
          document.cookie = event.data.value;
          break;
        case 'USER_RECEIVED':
          console.log('resolving', event.data);
          this.getUserPromise.resolve(event.data.value);
          this.getUserPromise = null;
          break;
      }
    }
  }

  getCookie = () => {
    const startIndex = document.cookie.indexOf(`NOATH_AUTH-${this.clientId}`);
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
      iframe.onload = () => {
        this.iframe.contentWindow.postMessage({ type: 'init', value: this.clientId}, '*')
      }
      iframe.src = IFRAME_URL
      iframe.id = IFRAME_ID
      iframe.crossorigin = "anonymous"
      this.iframe = iframe
    }
  }

  mountIframe = () => {
    if (!document.getElementById(IFRAME_ID)) {
      const wrapper = document.createElement('div')
      wrapper.id = NOATH_WRAPPER_ID
      wrapper.style = `z-index: ${Number.MAX_SAFE_INTEGER}; width: 0; height: 0`
      wrapper.appendChild(this.iframe)
      document.body.appendChild(wrapper)
    }
  }

  startFlow = () => {
    console.log('got here')
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