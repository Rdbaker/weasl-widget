import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AuthAPI } from 'api/auth.js';
import { EndUserAPI } from 'api/endUser.js';
import { OrgAPI } from 'api/org.js';
import { ActionTypes as AuthActionTypes } from 'modules/auth/constants';
import * as ShimActions from 'modules/shim/actions';
import * as UIActions from 'modules/ui/actions';
import { setToken } from 'utils/auth.js';
import *  as SharedEventTypes from 'shared/eventTypes';
import * as UISelectors from 'modules/ui/selectors';

import AuthModal from './containers/AuthModal';
import FloatingMessage from 'containers/FloatingMessage';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props)
    window.addEventListener("message", this.receiveMessage, false);
  }

  receiveMessage = (event) => {
    if(!!event && event.data && event.data.type) {
      switch(event.data.type) {
        case SharedEventTypes.INIT_IFRAME:
          this.handleInitEvent(event.data.value);
          break;
        case SharedEventTypes.GET_CURRENT_USER_VIA_JWT:
          this.handleGetUserEvent(event.data.value);
          break;
        case SharedEventTypes.SET_END_USER_ATTRIBUTE:
          this.handleSetAttributeEvent(event.data.value);
          break;
        case SharedEventTypes.VERIFY_EMAIL_TOKEN:
          this.handleVerifyEmailToken(event.data.value);
          break;
        case SharedEventTypes.START_AUTH_FLOW:
          this.handleStartAuthFlow(event.data.value);
          break;
        case SharedEventTypes.CHANGE_CONTAINER_CLASS_DONE:
          this.handleChangeContainerClassDone();
          break;
      }
    }
  }

  handleChangeContainerClassDone = () => {
    this.props.actions.changeContainerClassDone();
  }

  handleStartAuthFlow = (value) => {
    this.props.actions.startAuthFlow(value)
  }

  handleInitEvent = (clientId) => {
    global.clientId = clientId
    this.getPublicOrg()
  }

  handleVerifyEmailToken = async (emailToken) => {
    try {
      const { JWT } = await AuthAPI.verifyEmailToken(emailToken).then(res => res.json());
      if (JWT) {
        setToken(JWT);
      }
    } catch(e) {
      console.warn(e);
    }
  }

  handleGetUserEvent = async (token) => {
    try {
      const { data } = await EndUserAPI.getMe(token).then(res => res.json());
      window.parent.postMessage({type: SharedEventTypes.FETCH_CURRENT_USER_SUCCESS, value: data}, '*');
      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  handleSetAttributeEvent = async ({ token, name, value }) => {
    try {
      const { data } = await EndUserAPI.setAttribute(token, name, value).then(res => res.json());
      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  handleCancelUserFlow = () => {
    window.parent.postMessage({ type: SharedEventTypes.CANCEL_FLOW }, '*')
  }

  getPublicOrg = async () => {
    try {
      const { data } = await OrgAPI.getPublicOrg().then(res => res.json());
      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    const {
      showAuthModal,
      showInfoMsg,
      isHidden,
    } = this.props

    if (isHidden) {
      return null;
    }

    return (
      <div className="App">
        {showAuthModal && <AuthModal onClose={this.handleCancelUserFlow} />}
        {showInfoMsg && <FloatingMessage />}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    fetchSendSMSToken: AuthActionTypes.fetchSendSMSToken,
    fetchSendSMSTokenSuccess: AuthActionTypes.fetchSendSMSTokenSuccess,
    fetchSendSMSTokenFailed: AuthActionTypes.fetchSendSMSTokenFailed,
    fetchSendSMSTokenPending: AuthActionTypes.fetchSendSMSTokenPending,
    startAuthFlow: ShimActions.startAuthFlow,
    changeContainerClassDone: UIActions.changeContainerClassDone,
  }, dispatch)
})

const mapStateToProps = state => ({
  showAuthModal: UISelectors.showAuthModal(state),
  showInfoMsg: UISelectors.showInfoMsg(state),
  isHidden: UISelectors.uiHidden(state),
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
