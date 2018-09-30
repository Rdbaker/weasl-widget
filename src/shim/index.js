import * as EventTypes from 'shared/eventTypes';
import { UnmountedError } from 'shared/errors';
import { IFRAME_URL } from 'shared/resources';
import {
  TAKEOVER_CLASSNAME,
  INFO_MSG_CLASSNAME,
} from 'shared/iframeClasses';

import './style.css';


const WEASL_WRAPPER_ID = 'weasl-container';
const IFRAME_ID = 'weasl-iframe-element';


class Weasl {

  constructor(onloadFunc = function() {}) {
    this.onloadFunc = onloadFunc;
  }

  // PUBLIC API

  init = (clientId) => {
    this.clientId = clientId;
    this.detectEmailToken();
    this.initializeIframe();
    this.mountIframe();
  }

  login = () => {
    this.ensureMounted()
    this.flowPromise = new Promise((res, rej) => {
      this.onSuccessfulFlow = res
      this.onFailedFlow = rej
    });
    this.iframe.classList.add(TAKEOVER_CLASSNAME);
    this.startFlow();
    return this.flowPromise;
  }

  signup = () => {
    this.ensureMounted()
    this.flowPromise = new Promise((res, rej) => {
      this.onSuccessfulFlow = res
      this.onFailedFlow = rej
    });
    this.iframe.classList.add(TAKEOVER_CLASSNAME);
    this.startFlow('SIGNUP');
    return this.flowPromise;
  }

  onCancelFlow = () => {
    this.iframe.classList.remove(TAKEOVER_CLASSNAME);
    this.iframe.classList.remove(INFO_MSG_CLASSNAME);
    this.onFailedFlow('User cancelled login');
  }

  onFlowFinish = () => {
    this.iframe.classList.remove(TAKEOVER_CLASSNAME);
    this.getCurrentUser();
  }

  onChangeContainerClass = (classnames) => {
    this.iframe.className = classnames;
    this.iframe.contentWindow.postMessage({ type: EventTypes.CHANGE_CONTAINER_CLASS_DONE }, '*');
  }

  setAttribute = (name, value) => {
    this.ensureMounted()
    this.iframe.contentWindow.postMessage({type: EventTypes.SET_END_USER_ATTRIBUTE, value: { name, value, token: this.getCookie()}}, '*');
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

  detectEmailToken = () => {
    const param = window.location.search.substr(1).split('&').filter(qparam => qparam.startsWith('w_token'))
    if (param.length) {
      const emailToken = param[0].split('=')[1]
      if (emailToken) {
        this.emailToken = emailToken
        this.verifyEmailAfterMount = true
      }
    }
  }

  verifyEmailToken = () => {
    this.iframe.contentWindow.postMessage({type: EventTypes.VERIFY_EMAIL_TOKEN, value: this.emailToken }, '*')
  }

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
        case EventTypes.CANCEL_FLOW:
          this.onCancelFlow();
          break;
        case EventTypes.FINISH_FLOW:
          this.onFlowFinish();
          break;
        case EventTypes.CHANGE_CONTAINER_CLASS:
          this.onChangeContainerClass(event.data.value);
          break;
        case EventTypes.FETCH_CURRENT_USER_SUCCESS:
          this.onSuccessfulCurrentUserFetch(event.data.value);
          if (this.onSuccessfulFlow) this.onSuccessfulFlow(event.data.value);
          break;
      }
    }
  }

  guessIfUserIsLoggedIn = () => {
    return !!this.getCookie();
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
      const iframe = document.createElement('iframe');
      iframe.onload = () => {
        this.iframe.contentWindow.postMessage({ type: EventTypes.INIT_IFRAME, value: {
          cliendId: this.clientId,
          probablyLoggedIn: this.guessIfUserIsLoggedIn(),
        }}, '*');
        if (this.verifyEmailAfterMount) {
          this.verifyEmailAfterMount = false;
          this.verifyEmailToken();
        }
        this.onloadFunc();
      }
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

  startFlow = (flowType = 'LOGIN') => {
    this.iframe.contentWindow.postMessage({ type: EventTypes.START_AUTH_FLOW, value: flowType}, '*')
  }
}


export default ((window) => {
  const onloadFunc = (window.weasl && window.weasl.onload && typeof window.weasl.onload === 'function') ? window.weasl.onload : function(){};
  const weaslApi = () => {};
  const weasl = new Weasl(onloadFunc.bind(weaslApi, weaslApi));

  weaslApi.init = weasl.init;

  weaslApi.login = weasl.login;
  weaslApi.signup = weasl.signup;
  weaslApi.getCurrentUser = weasl.getCurrentUser;
  weaslApi.setAttribute = weasl.setAttribute;

  if (window.weasl) {
    const priorCalls = window.weasl._c;
    priorCalls.forEach(call => {
      const method = call[0];
      const args = call[1];
      if (method in weaslApi) {
        weaslApi[method].apply(weaslApi, args);
      }
    })
  }

  window.weasl = weaslApi
})(global)