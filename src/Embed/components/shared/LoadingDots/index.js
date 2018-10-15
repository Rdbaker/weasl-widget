import React from 'react';
import cx from 'classnames';

import './style.css';

const LoadingDots = ({ className }) => {
  const dots = [0, 1, 2].map((n) => (
    <div key={n}
         className="loading-dot"
         style={{ animationDelay: `${n * .2}s`}}></div>
  ))

  return (
    <div className={cx('LoadingDots', className)}>
      { dots }
    </div>
  )
}

export default LoadingDots