const NOATH_WRAPPER_ID = 'noath-container'
const IFRAME_URL = ENVIRONMENT === 'production' ? 'https://js.noath.co/index.html' : 'http://localhost:9001/index-embed.html'


class Noath {

  // PUBLIC API

  init = (clientId) => {
    this.clientId = clientId
    this.initializeIframe()
    this.mountIframe()
  }

  login = () => {
    // TODO: logic
    worked = Math.random() > 0.3

    return new Promise((res, rej) => setTimeout(worked ? res : rej, 1200, {id: 1234}))
  }

  register = () => {
    // TODO: logic
    worked = Math.random() > 0.3

    return new Promise((res, rej) => setTimeout(worked ? res : rej, 1200, {id: 1234}))
  }

  getCurrentUser = () => {
    // TODO: logic
    worked = Math.random() > 0.1

    return new Promise((res, rej) => setTimeout(worked ? res : rej, 200, {id: 1234}))
  }

  debug = () => {
    this.debug = !this.debug
    console.info(`[noath] debug mode ${this.debug ? 'enabled' : 'disabled'}`)
  }

  // PRIVATE METHODS

  initializeIframe() {
    const iframe = document.createElement('iframe')
    iframe.src = IFRAME_URL
    this.iframe = iframe
  }

  mountIframe() {
    const wrapper = document.createElement('div')
    wrapper.id = NOATH_WRAPPER_ID
    wrapper.style = `position: absolute; z-index: ${Number.MAX_SAFE_INTEGER}; width: 0; height: 0`
    wrapper.appendChild(this.iframe)
    document.body.appendChild(wrapper)
  }
}


export default ((window) => {
  // TODO: keep track of prior method calls
  const noath = new Noath()

  const noathApi = () => {}

  noathApi.init = noath.init

  // maybe these can all be the same function?
  noathApi.login = noath.login
  noathApi.register = noath.register
  noathApi.getCurrentUser = noath.getCurrentUser

  window.noath = noathApi
})(global)