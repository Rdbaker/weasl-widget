import { connect } from 'react-redux';

import AuthModal from 'components/AuthModal';
import * as AuthSelectors from 'modules/auth/selectors';

const mapStateToProps = state => ({
  sendTokenStatusPending: AuthSelectors.sendTokenStatusPending(state),
  sendTokenStatusSuccess: AuthSelectors.sendTokenStatusSuccess(state),
})


export default connect(mapStateToProps)(AuthModal);