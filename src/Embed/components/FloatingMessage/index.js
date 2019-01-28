import React from 'react';

import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';

import { ActionTypes } from 'modules/auth/constants';
import { ActionTypes as ShimActionTypes } from 'modules/shim/constants';
import { APP_URL } from 'shared/resources';

import FloatingMessage from './component';


const MessageTypes = {
  [ActionTypes.fetchVerifySMSToken]: 'PENDING',
  [ActionTypes.fetchVerifySMSTokenPending]: 'PENDING',
  [ActionTypes.fetchVerifySMSTokenSuccess]: 'SUCCESS',
  [ActionTypes.fetchVerifyEmailTokenSuccess]: 'SUCCESS',
  [ActionTypes.fetchVerifySMSTokenFailed]: 'FAILED',
  [ActionTypes.fetchVerifyEmailTokenFailed]: 'FAILED',
  [ActionTypes.fetchVerifyGoogleFailed]: 'FAILED',
  [ActionTypes.fetchVerifyGoogleSuccess]: 'SUCCESS',
  [ShimActionTypes.verifyDomainFailed]: 'FAILED',
}

const Icon = {
  [ActionTypes.fetchVerifyEmailTokenSuccess]: 'check',
  [ActionTypes.fetchVerifySMSTokenSuccess]: 'check',
  [ActionTypes.fetchVerifyGoogleSuccess]: 'check',
}


export default compose(
  withProps(props => {
    let message;
    let dismissAutomatically = true;
    let showBranding = true;
    if (props.verifyDomainFailed) {
      message = <span>This domain is not registered in your Weasl account. <a href={`${APP_URL}/account/settings`} target="_blank">View your settings</a></span>;
      dismissAutomatically = false;
      showBranding = false;
    } else if (props.infoMsgSuccess) {
      message = 'Login successful';
    } else if (props.infoMsgPending) {
      message = 'Logging you in';
    } else if (props.infoMsgFailed) {
      message = 'Unable to log you in';
    }
    return {
      message,
      type: MessageTypes[props.uiType],
      icon: Icon[props.uiType],
      dismissAutomatically,
      showBranding,
    }
  }),
  withState('shown', 'setShown', false),
  lifecycle({
    componentDidMount() {
      if (this.props.lastSentContainerClass !== '' && this.props.dismissAutomatically) {
        setTimeout(() => {
          this.props.setShown(true);
          setTimeout(() => {
            this.props.actions.changeContainerClass('');
          }, 1500);
        }, 3000)
      }
    }
  }),
)(FloatingMessage)