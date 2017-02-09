import React from 'react';

const Item = (props) => {
  return (
    <div
      style={props.css}
      className={props.class}>
      <div onClick={props.onClick}>
        <img className={props.class + '-cover'} src={props.cover} />
        <div className={props.class + '-infoBox'}>
          <span className={props.class + '-title'}>{props.title}</span>
          <span className={props.class + '-artist'}>{props.artist}</span>
          <span className={props.class + '-album'}>{props.album}</span>
        </div>
      </div>
      <button onClick={props.deleteItem}>
        <i className="minus circle icon"></i>
      </button>
    </div>
  );
};

export default Item;