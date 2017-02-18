import React from 'react';

const Control = (props) => {
  const color = {
    color: props.color.sub,
  };
  const active = {
    backgroundColor: props.color.sub,
    color: props.color.main,
  };
  return (
    <div className={props.class}>
      <button style={color} onClick={props.prevMusic}>
        <i className="step backward icon" />
      </button>
      <button style={color} onClick={props.musicPlayControl}>
        {props.playing
          ? <i className="pause icon" />
          : <i className="play icon" />
        }
      </button>
      <button style={color} onClick={props.nextMusic}>
        <i className="step forward icon" />
      </button>
      <button
        style={props.useRandom ? active : color}
        className={props.useRandom ? 'active' : ''}
        onClick={props.random}
      >
        <i className="random icon" />
      </button>
      <button
        style={props.useRepeat ? active : color}
        className={props.useRepeat ? 'active' : ''}
        onClick={props.repeat}
      >
        <i className="repeat icon" />
      </button>
    </div>
  );
};
export default Control;
