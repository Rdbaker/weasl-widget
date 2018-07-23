import React from 'react';

import './style.css';

export default ({
  type="primary",
  size="medium",
  className="",
  children,
  onClick,
}) => (
  <div className={`partnr-button partnr-button-${type} partnr-button-${size} ${className}`} onClick={onClick}>
    {children}
  </div>
);