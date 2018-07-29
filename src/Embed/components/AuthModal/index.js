import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';

import { AuthAPI } from 'api/auth.js';
import { setToken } from 'utils/auth.js';

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
      onEmailClick: props => () => ({
        authStep: AuthStep.CONFIRM_IDENTITY,
        authProvider: AuthProvider.EMAIL,
      }),
      onPhoneClick: props => () => ({
        authStep: AuthStep.CONFIRM_IDENTITY,
        authProvider: AuthProvider.PHONE,
      }),
      onEmailChange: props => e => ({
        emailInput: e.target.value
      }),
      onPhoneChange: props => e => ({
        phoneInput: e.target.value
      }),
      onBackClick: props => () => ({
        authStep: AuthStep.SELECT_PROVIDER,
        authProvider: null,
      }),
      onSubmit: props => () => {
        const submittedPhone = props.authProvider === AuthProvider.PHONE
        if (submittedPhone) {
          AuthAPI.sendLoginSMS(props.phoneInput)
        } else {
          AuthAPI.sendLoginEmail(props.emailInput)
        }
        return {
          authStep: submittedPhone ? AuthStep.CONFIRM_TEXT : AuthStep.EMAIL_SENT,
        }
      },
      onConfirmTextChange: props => e => {
        const code = e.target.value.slice(0, 6)
        if (code.length === 6) {
          AuthAPI.sendVerifySMS(code).then(res => res.json().then(json => setToken(json.JWT)))
        }
        return {
          confirmTextInput: code.toUpperCase()
        }
      },
    }
  )
)(AuthModal);