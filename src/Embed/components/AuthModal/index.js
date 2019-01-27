import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';
import withProps from 'recompose/withProps';
import getGoogleApi from 'google-client-api';

import { AuthAPI } from 'api/auth.js';

import AuthModal, {
  AuthType,
  AuthStep,
  AuthProvider,
} from './component.js';

export { AuthType }

export default compose(
  withState('authModalHidden', 'setAuthModalHidden', true),
  withProps(props => ({
    googleLoginTurnedOn: props.hasSocialLogin && props.googleLoginEnabled && props.googleClientId,
  })),
  lifecycle({
    componentDidMount() {
      if (this.props.googleLoginTurnedOn) {
        getGoogleApi().then(g => {
          g.client.init({
            clientId: this.props.googleClientId,
            scope: 'email'
          })
          .catch(err => console.warn(err))
        })
      }
      setTimeout(() => {
        this.props.setAuthModalHidden(false);
      }, 100)
    }
  }),
  withStateHandlers(
    {
      authStep: AuthStep.SELECT_PROVIDER,
      authProvider: null,
      emailInput: '',
      phoneInput: '',
      confirmTextInput: '',
    },
    {
      onGoogleCancel: () => () => ({
        authStep: AuthStep.SELECT_PROVIDER,
      }),
      onEmailClick: (state, props) => () => ({
        authStep: AuthStep.CONFIRM_IDENTITY,
        authProvider: AuthProvider.EMAIL,
      }),
      onPhoneClick: (state, props) => () => ({
        authStep: AuthStep.CONFIRM_IDENTITY,
        authProvider: AuthProvider.PHONE,
      }),
      onGoogleClick: (state, props) => () => ({
        authStep: AuthStep.WAIT_FOR_GOOGLE,
        authProvider: AuthProvider.GOOGLE,
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
  ),
  lifecycle({
    componentDidUpdate(prevProps) {
      if(this.props.authStep === AuthStep.WAIT_FOR_GOOGLE && prevProps.authStep !== AuthStep.WAIT_FOR_GOOGLE) {
        if (this.props.googleLoginTurnedOn) {
          getGoogleApi().then(g => {
            const gauth = g.auth2.getAuthInstance();
            gauth
              .signIn()
              .then((res) => {
                const token = res.Zi.access_token;
                this.props.actions.fetchVerifyGoogle(token);
              })
              .catch(reason => {
                console.warn(reason);
                this.props.onGoogleCancel();
              });
          });
        }
      }
    }
  })
)(AuthModal);