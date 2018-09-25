import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_URL } from 'shared/resources';

import './style.css';


const FloatingMessage = ({
  message,
  type,
  shown,
}) => (
  <div className={`floating-message-container floating-message-container--${type} ${shown && 'floating-message-container--shown'}`}>
    <div className="floating-message--icon"><FontAwesomeIcon icon="check" /></div>
    <div className="floating-message--text">
      {message}
      <a href={APP_URL} className="floating-message-powered-by" target="_blank" rel="noopener nofollower">🔐 by <span className="floating-message-powered-by-link">Weasl</span></a>
    </div>
  </div>
)

export default FloatingMessage