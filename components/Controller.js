import React from 'react';

const Controller = (props) => {
  return (
    <div className="music-controller">
      <input type="file" accept="audio/*"
        onChange={props.fileChange}
        />
      <audio crossOrigin="anonymous" controls
        src={props.src}
        onCanPlayThrough={props.handlePlay}
        onTimeUpdate={props.timeUpdate}
        ></audio>
      <button onClick={props.handleLyricsBtn}>{props.lyricsBtnText}</button>
      <button onClick={props.handleFindLyricsBtn}>FindLyrics</button>
    </div>
  );
};

export default Controller;