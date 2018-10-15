import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import {
  INFO_MSG_CLASSNAME,
} from 'shared/iframeClasses';

import { AuthAPI } from 'api/auth.js';

import AuthModal, {
  AuthType,
  AuthStep,
  AuthProvider,
} from './component.js';

export { AuthType }

export default compose(
  withStateHandlers(
    {
      authStep: AuthStep.SELECT_PROVIDER,
      authProvider: null,
      emailInput: '',
      phoneInput: '',
      confirmTextInput: '',
    },
    {
      onEmailClick: (state, props) => () => ({
        authStep: AuthStep.CONFIRM_IDENTITY,
        authProvider: AuthProvider.EMAIL,
      }),
      onPhoneClick: (state, props) => () => ({
        authStep: AuthStep.CONFIRM_IDENTITY,
        authProvider: AuthProvider.PHONE,
      }),
      onEmailChange: (state, props) => e => ({
        emailInput: e.target.value
      }),
      onPhoneChange: (state, props) => e => ({
        phoneInput: e.target.value
      }),
      onBackClick: (state, props) => () => ({
        authStep: AuthStep.SELECT_PROVIDER,
        authProvider: null,
      }),
      onSubmit: (state, props) => (e) => {
        const submittedPhone = state.authProvider === AuthProvider.PHONE
        if (submittedPhone) {
          props.actions.fetchSendSMSToken()
          props.actions.fetchSendSMSTokenPending()
          try {
            AuthAPI.sendLoginSMS(state.phoneInput)
            props.actions.fetchSendSMSTokenSuccess()
          } catch (e) {
            props.actions.fetchSendSMSTokenFailed()
          }
        } else {
          AuthAPI.sendLoginEmail(state.emailInput)
        }
        return {
          authStep: submittedPhone ? AuthStep.CONFIRM_TEXT : AuthStep.EMAIL_SENT,
        }
      },
      onConfirmTextChange: (state, props) => code => {
        if (code.length === 6 && !props.fetchVerifySMSTokenSuccess && !props.fetchVerifySMSTokenPending) {
          props.actions.fetchVerifySMSToken(code);
        }
        return {
          confirmTextInput: code.toUpperCase()
        }
      },
    }
  )
)(AuthModal);