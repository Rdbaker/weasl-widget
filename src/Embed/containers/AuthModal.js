import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AuthModal from 'components/AuthModal';
import * as OrgSelectors from 'modules/org/selectors';
import * as AuthSelectors from 'modules/auth/selectors';
import * as UISelectors from 'modules/ui/selectors';
import * as AuthActions from 'modules/auth/actions';


const mapStateToProps = state => ({
  verifyTokenPending: AuthSelectors.verifyTokenPending(state),
  verifyTokenFailed: AuthSelectors.verifyTokenFailed(state),
  authType: UISelectors.uiType(state),
  smsLoginDisabled: OrgSelectors.getSmsLoginDisabled(state),
  hasSocialLogin: OrgSelectors.getHasSocialLogin(state),
  googleLoginEnabled: OrgSelectors.getGoogleLoginEnabled(state),
  googleClientId: OrgSelectors.getGoogleClientId(state),
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    fetchSendSMSToken: AuthActions.fetchSendSMSToken,
    fetchSendSMSTokenSuccess: AuthActions.fetchSendSMSTokenSuccess,
    fetchSendSMSTokenFailed: AuthActions.fetchSendSMSTokenFailed,
    fetchSendSMSTokenPending: AuthActions.fetchSendSMSTokenPending,

    fetchVerifySMSToken: AuthActions.fetchVerifySMSToken,
    fetchVerifySMSTokenPending: AuthActions.fetchVerifySMSTokenPending,
    fetchVerifySMSTokenSuccess: AuthActions.fetchVerifySMSTokenSuccess,
    fetchVerifySMSTokenFailed: AuthActions.fetchVerifySMSTokenFailed,

    fetchVerifyGoogle: AuthActions.fetchVerifyGoogle,
  }, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);