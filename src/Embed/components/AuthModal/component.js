import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import Button from 'components/shared/Button';
import LoadingDots from 'components/shared/LoadingDots';
import { WWW_URL } from 'shared/resources';
import { isMobile } from 'shared/helpers';

import './style.css';
import GoogleLogo from './googleLogo';

export const AuthType = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
};

const AuthTypeDisplay = {
  [AuthType.LOGIN]: 'Log In',
  [AuthType.SIGNUP]: 'Sign Up',
};

const possibleSMSChars = 'a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9'.split(' ');

export const AuthStep = {
  SELECT_PROVIDER: 'SELECT_PROVIDER',
  CONFIRM_IDENTITY: 'CONFIRM_IDENTITY',
  CONFIRM_TEXT: 'CONFIRM_TEXT',
  EMAIL_SENT: 'EMAIL_SENT',
  WAIT_FOR_GOOGLE: 'WAIT_FOR_GOOGLE',
};


export const AuthProvider = {
  PHONE: 'Phone number',
  EMAIL: 'Email address',
  GOOGLE: <span><GoogleLogo /> Google Account</span>,
};


const AuthModalHeader = ({
  authType,
}) => (
  <div className="auth-modal-header-container">
    <h1>{AuthTypeDisplay[authType]}</h1>
  </div>
);


const AuthProviderSelect = ({
  onEmailClick,
  onPhoneClick,
  onGoogleClick,
  googleLoginTurnedOn,
  authType,
  smsLoginDisabled,
}) => (
  <div>
    <div className="auth-modal-provider-help">
      <p>What do you want to use to {authType.toLowerCase()}?</p>
    </div>
    <Button onClick={onEmailClick} type="secondary" className={cx('auth-modal-provider-button', { mobile: isMobile() })}>{AuthProvider.EMAIL}</Button>
    {!smsLoginDisabled && <Button onClick={onPhoneClick} type="secondary" className={cx('auth-modal-provider-button',  { mobile: isMobile() })}>{AuthProvider.PHONE}</Button>}
    {googleLoginTurnedOn && <Button onClick={onGoogleClick} type="secondary" className={cx('auth-modal-provider-button',  { mobile: isMobile() })}>{AuthProvider.GOOGLE}</Button>}
  </div>
);

const AuthIdentityConfirm = ({
  authProvider,
  onBackClick,
  emailInput,
  phoneInput,
  onEmailChange,
  onPhoneChange,
  onSubmit,
}) => (
  <div>
    <Button type="link" onClick={onBackClick}>&lt; Back</Button>
    <form className="auth-modal-identity-confirm-form" onSubmit={onSubmit}>
      <p>Enter your {authProvider.toLowerCase()}</p>
      <div className={cx('auth-modal-identity-input-container', { mobile: isMobile() })}>
        {authProvider === AuthProvider.EMAIL &&
          <input className={cx({mobile : isMobile()})} onChange={onEmailChange} value={emailInput} type="email" placeholder="enter your email" />
        }
        {authProvider === AuthProvider.PHONE &&
          <input className={cx({mobile : isMobile()})} onChange={onPhoneChange} value={phoneInput} type="tel" placeholder="enter your phone number"/>
        }
        <Button size={isMobile() ? 'medium' : 'small'} onClick={onSubmit}>Go</Button>
      </div>
    </form>
  </div>
);


const WaitForGoogle = () => (
  <div className="weasl-auth-wait-for-google--text">Waiting for <GoogleLogo /> Login <LoadingDots /></div>
)

class AuthConfirmSMS extends React.Component {
  numChars = 6;

  constructor(props) {
    super(props);

    this.inputs = [];

    this.state = {
      charIndex: 0,
      chars: ['', '', '', '', '', ''],
    }
  }

  componentDidMount() {
    this.inputs[0].focus();
  }

  makeOnEditChar = (index) => {
    return (e) => this.onEditChar(index, e);
  }

  onKeyDown = (event) => {
    const {
      chars,
      charIndex,
    } = this.state;

    const {
      onConfirmTextChange
    } = this.props;

    const isBackspace = event.keyCode === 8

    if (isBackspace) {
      event.preventDefault()
      if (charIndex > 0) {
        let newIndex = charIndex - 1;
        // either remove current text or remove previous text
        if (!!chars[charIndex]) {
          chars[charIndex] = '';
          newIndex = charIndex;
        } else {
          chars[newIndex] = '';
          this.inputs[newIndex].focus();
        }
        this.setState({
          charIndex: newIndex,
          chars,
        }, () => onConfirmTextChange(chars.join('')));
      }
    }
  }

  onEditChar = (index, event) => {
    const {
      chars,
      charIndex,
    } = this.state;

    const {
      onConfirmTextChange
    } = this.props;

    const key = event.target.value;
    if (!possibleSMSChars.includes(key)) return;
    chars[index] = key.toUpperCase();
    if (charIndex + 1 < this.numChars) {
      const newIndex = charIndex + 1;
      this.inputs[newIndex].focus();
      this.setState({ charIndex: newIndex });
    }
    this.setState({chars}, () => onConfirmTextChange(chars.join('')));
  }

  render() {
    const {
      verifyTokenPending,
      verifyTokenFailed,
    } = this.props

    const {
      chars,
    } = this.state

    return (
      <div className="auth-modal-sms-verify">
        <p>We sent you a text code, confirm it here:</p>
        <div className={cx('auth-modal-sms-verify-inputs', { mobile : isMobile() })}>
          {chars.map((char, i) => <input key={i} type="text" ref={e => this.inputs[i] = e} className={cx('sms-char-code-input',  {mobile : isMobile(), 'is-completed': !!char})} value={char} onChange={this.makeOnEditChar(i)} onKeyDown={this.onKeyDown} />)}
        </div>
        {verifyTokenPending && <div className="auth-modal-sms-verify-pending--helptext">Authenticating<LoadingDots /></div>}
        {verifyTokenFailed && <div className="auth-modal-sms-verify-failed--helptext">Invalid or inactive token.</div>}
      </div>
    );
  }
}

const AuthEmailSent = ({
  onResendEmailClick,
  email,
}) => (
  <div>We sent a login email to {email}</div>
);


export default ({
  authModalHidden,
  authType = AuthType.LOGIN,
  authStep,
  onEmailClick,
  onPhoneClick,
  authProvider,
  onBackClick,
  onClose,
  onEmailChange,
  onPhoneChange,
  onGoogleClick,
  emailInput,
  phoneInput,
  onSubmit,
  onConfirmTextChange,
  confirmTextInput,
  verifyTokenPending,
  verifyTokenFailed,
  smsLoginDisabled,
  googleLoginTurnedOn,
}) => (
  <div className={cx("auth-modal-container", { "auth-modal-container--hidden": authModalHidden })}>
    <div className="auth-modal-overlay-mask" onClick={onClose} />
    <div className={cx('auth-modal-content', { mobile : isMobile(), 'auth-modal-content--hidden': authModalHidden })}>
      <AuthModalHeader authType={authType} />
      {authStep === AuthStep.SELECT_PROVIDER &&
        <AuthProviderSelect
          onEmailClick={onEmailClick}
          onPhoneClick={onPhoneClick}
          onGoogleClick={onGoogleClick}
          googleLoginTurnedOn={googleLoginTurnedOn}
          authType={authType}
          smsLoginDisabled={smsLoginDisabled}
        />
      }
      {authStep === AuthStep.CONFIRM_IDENTITY &&
        <AuthIdentityConfirm
          authProvider={authProvider}
          onBackClick={onBackClick}
          onEmailChange={onEmailChange}
          emailInput={emailInput}
          onPhoneChange={onPhoneChange}
          phoneInput={phoneInput}
          onSubmit={onSubmit}
        />
      }
      {authStep === AuthStep.CONFIRM_TEXT &&
        <AuthConfirmSMS onConfirmTextChange={onConfirmTextChange} confirmTextInput={confirmTextInput} verifyTokenPending={verifyTokenPending} verifyTokenFailed={verifyTokenFailed} />
      }
      {authStep === AuthStep.EMAIL_SENT &&
        <AuthEmailSent email={emailInput} />
      }
      {authStep === AuthStep.WAIT_FOR_GOOGLE &&
        <WaitForGoogle />
      }
      <a href={WWW_URL} className="weasl-poweredby-container" target="_blank" rel="noopener nofollower">
        Login <FontAwesomeIcon icon="lock" color="#fcc21b" /> by <span className="weasl-poweredby-link">Weasl</span>.
      </a>
    </div>
  </div>
);