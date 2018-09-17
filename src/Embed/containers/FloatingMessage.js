import { connect } from 'react-redux';

import FloatingMessage from 'components/FloatingMessage';
import * as AuthSelectors from 'modules/auth/selectors';

const mapStateToProps = state => ({
  sendTokenStatusPending: AuthSelectors.sendTokenStatusPending(state),
  sendTokenStatusSuccess: AuthSelectors.sendTokenStatusSuccess(state),
  infoMsgSuccess: AuthSelectors.infoMsgSuccess(state),
  infoMsgPending: AuthSelectors.infoMsgPending(state),
  infoMsgFailed: AuthSelectors.infoMsgFailed(state),
  uiType: AuthSelectors.uiType(state),
})


export default connect(mapStateToProps)(FloatingMessage);