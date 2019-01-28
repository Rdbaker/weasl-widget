import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { WWW_URL } from 'shared/resources';

import './style.css';


const FloatingMessage = ({
  message,
  type,
  shown,
  showBranding,
  icon,
}) => (
  <div className={`floating-message-container floating-message-container--${type} ${shown && 'floating-message-container--shown'}`}>
    {icon && <div className="floating-message--icon"><FontAwesomeIcon icon={icon} /></div>}
    <div className="floating-message--text">
      {message}
      {showBranding && <a href={WWW_URL} className="floating-message-powered-by" target="_blank" rel="noopener nofollower"><FontAwesomeIcon icon="lock" color="#fcc21b" /> by <span className="floating-message-powered-by-link">Weasl</span></a>}
    </div>
  </div>
)

export default FloatingMessage