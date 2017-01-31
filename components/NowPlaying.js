import React from 'react';

const NowPlaying = (props) => {
  return (
    <div className="nowPlaying">      
      <h3 className="nowPlaying__artist">{props.data.artist}</h3>
      <h3 className="nowPlaying__title">{props.data.title}</h3>
      <h3 className="nowPlaying__album">{props.data.album}</h3>
    </div>
  );
};

export default NowPlaying;