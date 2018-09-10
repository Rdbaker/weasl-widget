import React from 'react';

import Button from 'components/shared/Button';
import { APP_URL } from 'shared/resources';

import './style.css';

export const AuthType = {
  LOGIN: 'Log In',
  SIGNUP: 'Sign Up',
};


export const AuthStep = {
  SELECT_PROVIDER: 'SELECT_PROVIDER',
  CONFIRM_IDENTITY: 'CONFIRM_IDENTITY',
  CONFIRM_TEXT: 'CONFIRM_TEXT',
  EMAIL_SENT: 'EMAIL_SENT',
};


export const AuthProvider = {
  PHONE: 'Phone number',
  EMAIL: 'Email address',
};


const AuthModalHeader = ({
  authType,
}) => (
  <div className="auth-modal-header-container">
    <h1>{authType}</h1>
  </div>
);


const AuthProviderSelect = ({
  onEmailClick,
  onPhoneClick,
  authType,
}) => (
  <div>
    <div className="auth-modal-provider-help">
      <p>What do you want to use to {authType.toLowerCase()}?</p>
    </div>
    <Button onClick={onEmailClick} type="secondary" className="auth-modal-provider-button">{AuthProvider.EMAIL}</Button>
    <Button onClick={onPhoneClick} type="secondary" className="auth-modal-provider-button">{AuthProvider.PHONE}</Button>
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
    <form className="auth-modal-identity-confirm-form">
      <p>Enter your {authProvider.toLowerCase()}</p>
      <div className="auth-modal-identity-input-container">
        {authProvider === AuthProvider.EMAIL &&
          <input onChange={onEmailChange} value={emailInput} type="email" placeholder="enter your email" />
        }
        {authProvider === AuthProvider.PHONE &&
          <input onChange={onPhoneChange} value={phoneInput} type="tel" placeholder="enter your phone number"/>
        }
        <Button size="small" onClick={onSubmit}>Go</Button>
      </div>
    </form>
  </div>
)

const AuthConfirmSMS = ({
  onResendTextClick,
  onConfirmTextChange,
  confirmTextInput,
}) => (
  <div className="auth-modal-sms-verify">
    <p>We sent you a text with a code, confirm it here:</p>
    <input type="text" value={confirmTextInput} onChange={onConfirmTextChange} />
  </div>
)

const AuthEmailSent = ({
  onResendEmailClick,
}) => (
  <div>We sent you an email</div>
)


export default ({
  authType = AuthType.LOGIN,
  authStep,
  onEmailClick,
  onPhoneClick,
  authProvider,
  onBackClick,
  onClose,
  onEmailChange,
  onPhoneChange,
  emailInput,
  phoneInput,
  onSubmit,
  onConfirmTextChange,
  confirmTextInput,
}) => (
  <div className="auth-modal-container">
    <div className="auth-modal-overlay-mask" onClick={onClose} />
    <div className="auth-modal-content">
      <AuthModalHeader authType={authType} />
      {authStep === AuthStep.SELECT_PROVIDER &&
        <AuthProviderSelect onEmailClick={onEmailClick} onPhoneClick={onPhoneClick} authType={authType} />
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
        <AuthConfirmSMS onConfirmTextChange={onConfirmTextChange} confirmTextInput={confirmTextInput} />
      }
      {authStep === AuthStep.EMAIL_SENT &&
        <AuthEmailSent />
      }
      <a href={APP_URL} className="weasl-poweredby-container" target="_blank" rel="noopener nofollower">
        We're 🔐 by <span className="weasl-poweredby-link">Weasl</span>.
      </a>
    </div>
  </div>
);