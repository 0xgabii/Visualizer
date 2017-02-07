import React from 'react';

const Control = (props) => {
  const color = {
    color: props.color
  }
  return (
    <div className={props.class}>
      <button style={color}>
        <i className="step backward icon"></i>
      </button>
      <button style={color}>
        {props.play
          ? <i class="pause icon"></i>
          : <i className="play icon"></i>
        }
      </button>
      <button style={color}>
        <i className="step forward icon"></i>
      </button>
      <button style={color}>
        <i className={props.random ? "random icon active" : "random icon"}></i>
      </button>
      <button style={color}>
        <i className={props.repeat ? "repeat icon active" : "repeat icon"}></i>
      </button>
    </div>
  );
};

export default Control;