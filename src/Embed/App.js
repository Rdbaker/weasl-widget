import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AuthAPI } from 'api/auth.js';
import { EndUserAPI } from 'api/endUser.js';
import { OrgAPI } from 'api/org.js';
import { ActionTypes as AuthActionTypes } from 'modules/auth/constants';
import * as ShimActions from 'modules/shim/actions';
import { setToken } from 'utils/auth.js';
import *  as EventTypes from 'shared/eventTypes';
import * as AuthSelectors from 'modules/auth/selectors';

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
        case EventTypes.INIT_IFRAME:
          this.handleInitEvent(event.data.value);
          break;
        case EventTypes.GET_CURRENT_USER_VIA_JWT:
          this.handleGetUserEvent(event.data.value);
          break;
        case EventTypes.SET_END_USER_ATTRIBUTE:
          this.handleSetAttributeEvent(event.data.value);
          break;
        case EventTypes.VERIFY_EMAIL_TOKEN:
          this.handleVerifyEmailToken(event.data.value);
          break;
        case EventTypes.START_LOGIN_FLOW:
          this.handleStartLoginFlow(event.data.value);
          break;
      }
    }
  }

  handleStartLoginFlow = (value) => {
    this.props.actions.startLoginFlow(value)
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
      window.parent.postMessage({type: EventTypes.FETCH_CURRENT_USER_SUCCESS, value: data}, '*');
      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  handleSetAttributeEvent = async ({ token, name, value }) => {
    try {
      const { data } = await EndUserAPI.setAttribute(token, name, value).then(res => res.json());
      // window.parent.postMessage({type: EventTypes.FETCH_CURRENT_USER_SUCCESS, value: data}, '*');
      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  handleCancelUserFlow = () => {
    window.parent.postMessage({ type: EventTypes.CANCEL_FLOW }, '*')
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
        {showAuthModal && <AuthModal authType={'LOGIN'} onClose={this.handleCancelUserFlow} />}
        {false && showInfoMsg && <FloatingMessage />}
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
    startLoginFlow: ShimActions.startLoginFlow,
  }, dispatch)
})

const mapStateToProps = state => ({
  showAuthModal: AuthSelectors.showAuthModal(state),
  showInfoMsg: AuthSelectors.showInfoMsg(state),
  isHidden: AuthSelectors.uiHidden(state),
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
