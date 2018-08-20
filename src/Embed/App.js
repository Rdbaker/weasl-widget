import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AuthAPI } from 'api/auth.js';
import { EndUserAPI } from 'api/endUser.js';
import { OrgAPI } from 'api/org.js';
import { ActionTypes as AuthActionTypes } from 'modules/auth/constants';
import *  as EventTypes from 'shared/eventTypes';
import * as AuthSelectors from 'modules/auth/selectors';

import AuthModal from './components/AuthModal';
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
      }
    }
  }

  handleInitEvent = (clientId) => {
    global.clientId = clientId
    this.getPublicOrg()
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
      authModalType,
    } = this.props

    return (
      <div className="App">
        <AuthModal authType={authModalType} onClose={this.handleCancelUserFlow} />
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
  }, dispatch)
})

const mapStateToProps = state => ({
  showAuthModal: AuthSelectors.showAuthModal(state),
  authModalType: AuthSelectors.authModalType(state),
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
