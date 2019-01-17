import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as UIActions from 'modules/ui/actions';
import *  as SharedEventTypes from 'shared/eventTypes';
import * as UISelectors from 'modules/ui/selectors';

import AuthModal from './containers/AuthModal';
import FloatingMessage from 'containers/FloatingMessage';
import './WeaslEmbed.css';


class WeaslEmbed extends Component {
  constructor(props) {
    super(props)
    window.addEventListener("message", this.receiveMessage, false);
  }

  receiveMessage = (event) => {
    if(this.isWeaslEvent(event)) {
      this.props.dispatch({ type: event.data.type, payload: event.data.value });
    }
  }

  isWeaslEvent = (event) => {
    return !!event && event.data && event.data.type && event.data.type in SharedEventTypes;
  }

  handleCancelUserFlow = () => {
    this.props.actions.setViewAndType({ view: undefined, type: undefined });
    window.parent.postMessage({ type: SharedEventTypes.CANCEL_FLOW }, '*');
  }

  render() {
    const {
      showAuthModal,
      showInfoMsg,
      isHidden,
    } = this.props

    if (isHidden) {
      return null;
    }

    return (
      <div className="App">
        {showAuthModal && <AuthModal onClose={this.handleCancelUserFlow} />}
        {showInfoMsg && <FloatingMessage />}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    setViewAndType: UIActions.setViewAndType,
  }, dispatch),
  dispatch,
})

const mapStateToProps = state => ({
  showAuthModal: UISelectors.showAuthModal(state),
  showInfoMsg: UISelectors.showInfoMsg(state),
  isHidden: UISelectors.uiHidden(state),
})


export default connect(mapStateToProps, mapDispatchToProps)(WeaslEmbed);
