import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';

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
  withStateHandlers(
    {
      startedAt: new Date(),
      expanded: true,
    },
    {
      finishFlow: (state, props) => () => ({
        expanded: false
      })
    }
  )
)(FloatingMessage)