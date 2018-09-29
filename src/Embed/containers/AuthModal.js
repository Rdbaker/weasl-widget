import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AuthModal from 'components/AuthModal';
import * as AuthSelectors from 'modules/auth/selectors';
import * as UISelectors from 'modules/ui/selectors';
import * as AuthActions from 'modules/auth/actions';
import * as UIActions from 'modules/ui/actions';


const mapStateToProps = state => ({
  sendTokenStatusPending: AuthSelectors.sendTokenStatusPending(state),
  sendTokenStatusSuccess: AuthSelectors.sendTokenStatusSuccess(state),
  authType: UISelectors.uiType(state),
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

    changeContainerClass: UIActions.changeContainerClass,
    setViewAndType: UIActions.setViewAndType,
  }, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);