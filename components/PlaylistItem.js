import React from 'react';

const Item = (props) => {
  return (
    <div
      onClick={props.onClick}
      style={props.css}
      className={props.class}>
      <img className={props.class + '-cover'} src={props.cover} />
      <div className={props.class + '-infoBox'}>
        <span className={props.class + '-title'}>{props.title}</span>
        <span className={props.class + '-artist'}>{props.artist}</span>
        <span className={props.class + '-album'}>{props.album}</span>
      </div>
    </div>
  );
};

export default Item;