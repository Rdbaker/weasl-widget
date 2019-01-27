export const ActionTypes = {
  fetchSendSMSToken: 'FETCH_SEND_SMS_TOKEN',
  fetchSendSMSTokenPending: 'FETCH_SEND_SMS_TOKEN_PENDING',
  fetchSendSMSTokenFailed: 'FETCH_SEND_SMS_TOKEN_FAILED',
  fetchSendSMSTokenSuccess: 'FETCH_SEND_SMS_TOKEN_SUCCESS',

  fetchVerifySMSToken: 'FETCH_VERIFY_SMS_TOKEN',
  fetchVerifySMSTokenPending: 'FETCH_VERIFY_SMS_TOKEN_PENDING',
  fetchVerifySMSTokenFailed: 'FETCH_VERIFY_SMS_TOKEN_FAILED',
  fetchVerifySMSTokenSuccess: 'FETCH_VERIFY_SMS_TOKEN_SUCCESS',

  fetchVerifyEmailTokenSuccess: 'FETCH_VERIFY_EMAIL_TOKEN_SUCCESS',
  fetchVerifyEmailTokenFailed: 'FETCH_VERIFY_EMAIL_TOKEN_FAILED',

  fetchVerifyGoogle: 'FETCH_VERIFY_GOOGLE',
  fetchVerifyGoogleSuccess: 'FETCH_VERIFY_GOOGLE_SUCCESS',
  fetchVerifyGoogleFailed: 'FETCH_VERIFY_GOOGLE_FAILED',

  fetchCurrentEndUser: 'FETCH_CURRENT_END_USER',
  fetchCurrentEndUserPending: 'FETCH_CURRENT_END_USER_PENDING',
  fetchCurrentEndUserFailed: 'FETCH_CURRENT_END_USER_FAILED',
  fetchCurrentEndUserSuccess: 'FETCH_CURRENT_END_USER_SUCCESS',

  setLoggedInOnInitGuess: 'SET_LOGGED_IN_ON_INIT_GUESS',
}


export const IframeViews = {
  NONE: 'NONE',
  AUTH_MODAL: 'AUTH_MODAL',
  INFO_MSG: 'INFO_MSG',
}