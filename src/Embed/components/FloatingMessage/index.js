import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';

import { ActionTypes } from 'modules/auth/constants';

import FloatingMessage from './component';


const MessageTypes = {
  [ActionTypes.fetchVerifySMSToken]: 'PENDING',
  [ActionTypes.fetchVerifySMSTokenPending]: 'PENDING',
  [ActionTypes.fetchVerifySMSTokenSuccess]: 'SUCCESS',
  [ActionTypes.fetchVerifySMSTokenFailed]: 'FAILED',
}


export default compose(
  withProps(props => {
    let message;
    if (props.infoMsgSuccess) {
      message = 'Login successful';
    } else if (props.infoMsgPending) {
      message = 'Logging you in';
    } else if (props.infoMsgFailed) {
      message = 'Unable to log you in';
    }
    return {
      message,
      type: MessageTypes[props.uiType],
    }
  }),
  withState('shown', 'setShown', false),
  lifecycle({
    componentDidMount() {
      setTimeout(() => {
        this.props.setShown(true);
        setTimeout(() => {
          this.props.actions.changeContainerClass('');
        }, 1500);
      }, 3000)
    }
  }),
)(FloatingMessage)