import * as EventTypes from 'shared/eventTypes';
import {
  UnmountedError,
  ResponseError,
  DomainVerificationError
} from 'shared/errors';
import { IFRAME_URL } from 'shared/resources';
import {
  TAKEOVER_CLASSNAME,
  INFO_MSG_CLASSNAME,
} from 'shared/iframeClasses';
import { expireToken } from 'shared/helpers';

import './style.css';


const WEASL_WRAPPER_ID = 'weasl-container';
const IFRAME_ID = 'weasl-iframe-element';


class Weasl {

  constructor(onloadFunc = function() {}, onMagiclinkSuccessFunc = function() {}) {
    this.debugMode = false;
    this.onloadFunc = onloadFunc;
    this.onMagiclinkSuccessFunc = onMagiclinkSuccessFunc;
    this.domainAllowed = true; // optimistically assume for now
  }

  // PUBLIC API

  init = (clientId) => {
    this.clientId = clientId;
    this.detectEmailToken();
    this.initializeIframe();
    this.mountIframe();
  }

  login = () => {
    this.ensureAllowed();
    this.ensureMounted();
    this.flowPromise = new Promise((res, rej) => {
      this.onSuccessfulFlow = res
      this.onFailedFlow = rej
    });
    this.iframe.classList.add(TAKEOVER_CLASSNAME);
    this.startFlow();
    return this.flowPromise;
  }

  signup = () => {
    this.ensureAllowed();
    this.ensureMounted()
    this.flowPromise = new Promise((res, rej) => {
      this.onSuccessfulFlow = res
      this.onFailedFlow = rej
    });
    this.iframe.classList.add(TAKEOVER_CLASSNAME);
    this.startFlow('SIGNUP');
    return this.flowPromise;
  }

  logout = () => {
    this.ensureAllowed();
    let reject = () => {};
    let resolve = () => {};
    const logoutPromise = new Promise((res, rej) => {
      reject = rej;
      resolve = res;
    });
    try {
      expireToken(this.clientId);
      resolve();
    } catch (err) {
      reject();
    }
    return logoutPromise;
  }

  setAttribute = (name, value, type='STRING') => {
    this.ensureAllowed();
    this.ensureMounted();
    this.iframe.contentWindow.postMessage({type: EventTypes.SET_END_USER_ATTRIBUTE, value: { name, value, token: this.getCookie(), type }}, '*');
  }

  getCurrentUser = () => {
    this.ensureAllowed();
    this.ensureMounted()
    const getUserPromise = new Promise((res, rej) => {
      this.onSuccessfulCurrentUserFetch = res
      this.onFailedCurrentUserFetch = rej
    });
    this.iframe.contentWindow.postMessage({type: EventTypes.GET_CURRENT_USER_VIA_JWT, value: this.getCookie()}, '*');
    return getUserPromise;
  }

  debug = () => {
    this.ensureAllowed();
    this.debugMode = !this.debugMode
    console.info(`[Weasl] debug mode ${this.debugMode ? 'enabled' : 'disabled'}`)
    this.iframe.contentWindow.postMessage({type: EventTypes.SET_DEBUG_MODE, value: this.debugMode}, '*');
  }

  // PRIVATE METHODS

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

  ensureAllowed = () => {
    if (!this.domainAllowed) {
      throw new DomainVerificationError(`${window.location.host} is not permitted to use client ID ${this.clientId}`);
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
        case EventTypes.FETCH_CURRENT_USER_FAILED:
          const err = typeof event.data.value === 'string' ? new ResponseError('Internal error') : new ResponseError(event.data.value.error_message, event.data.value);
          this.onFailedCurrentUserFetch(err);
        case EventTypes.FETCH_CURRENT_USER_SUCCESS:
          this.onSuccessfulCurrentUserFetch(event.data.value);
          if (this.onSuccessfulFlow) this.onSuccessfulFlow(event.data.value);
          break;
        case EventTypes.VERIFY_EMAIL_TOKEN_SUCCESS:
          this.onMagiclinkSuccessFunc();
          break;
        case EventTypes.DOMAIN_NOT_ALLOWED:
          this.handleDomainNotAllowed();
          break;
        case EventTypes.BOOTSTRAP_DONE:
          this.handleBootstrapDone();
          break;
      }
    }
  }

  handleBootstrapDone = () => {
    const weaslApi = window.weasl;
    weaslApi.login = weasl.login;
    weaslApi.signup = weasl.signup;
    weaslApi.getCurrentUser = weasl.getCurrentUser;
    weaslApi.setAttribute = weasl.setAttribute;
    weaslApi.logout = weasl.logout;
    weaslApi.debug = weasl.debug;
    weaslApi._c = window.weasl._c;

    this.runPriorCalls();
    window.weasl = weaslApi;
  }

  handleDomainNotAllowed = () => {
    this.domainAllowed = false;
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
          clientId: this.clientId,
          probablyLoggedIn: this.guessIfUserIsLoggedIn(),
          topHost: window.location.host,
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

  runPriorCalls = () => {
    const allowedCalls = ['login', 'signup', 'setAttribute', 'getCurrentUser', 'logout', 'debug'];
    const priorCalls = (window.weasl && window.weasl._c && typeof window.weasl._c === 'object') ? window.weasl._c : [];
    priorCalls.forEach(call => {
      const method = call[0];
      const args = call[1];
      if (allowedCalls.includes(method)) {
        this[method].apply(this, args);
      }
    })
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
  const onMagiclinkSuccessFunc = (window.weasl && window.weasl.onEmailVerify && typeof window.weasl.onEmailVerify === 'function') ? window.weasl.onEmailVerify : function(){};
  const initCall = window.weasl._c.find(call => call[0] === 'init');
  const weaslApi = () => {};
  const weasl = new Weasl(onloadFunc.bind(weaslApi, weaslApi), onMagiclinkSuccessFunc.bind(weaslApi, weaslApi));

  weaslApi.init = weasl.init;

  weaslApi[initCall[0]].apply(weaslApi, initCall[1]);
})(global)