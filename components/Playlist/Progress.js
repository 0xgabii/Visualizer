import React from 'react';

const componentName = props =>
  <div
    className={props.class}
    onClick={props.onClick}
  ><div style={props.style} />
  </div>;
export default componentName;
