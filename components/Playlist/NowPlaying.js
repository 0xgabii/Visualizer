import React from 'react';

const NowPlaying = props =>
  <div
    className={props.class}
    onClick={props.onClick}
  >
    <img className={`${props.class}-cover`} src={props.data.cover} alt="nowPlaying" />
    <div className={`${props.class}-infoBox`}>
      <span className={`${props.class}-title`}>{props.data.title}</span>
      <span className={`${props.class}-artist`}>{props.data.artist}</span>
      <span className={`${props.class}-album`}>{props.data.album}</span>
    </div>
  </div>;
export default NowPlaying;
