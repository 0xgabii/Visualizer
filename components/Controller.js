import React, { Component } from 'react';

class Controller extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.selectMusic = this.selectMusic.bind(this);
  }
  // open input[file]
  selectMusic() {
    const file = document.getElementById('audioFile');
    file.click();
  }
  render() {
    const invisible = {
      width: 0,
      height: 0,
      opacity: 0
    }
    return (
      <div className="music-controller">
        <input style={invisible} id="audioFile" type="file" accept="audio/*"
          onChange={this.props.fileChange}
          />
        <audio crossOrigin="anonymous" controls
          src={this.props.src}
          onCanPlayThrough={this.props.handlePlay}
          onTimeUpdate={this.props.timeUpdate}
          ></audio>
        <div className="btnGroup__audio">
          <button onClick={this.selectMusic}>Select Music</button>
          <button><i className="material-icons">play_arrow</i></button>
          <button><i className="material-icons">subtitles</i></button>
        </div>
        <div className="btnGroup__controller">
          <button onClick={this.props.handleLyricsBtn}>{this.props.lyricsBtnText}</button>
          <button onClick={this.props.handleFindLyricsBtn}>FindLyrics</button>
          <button onClick={this.props.handleReversalBtn}>ColorReversal</button>
          <button onClick={this.props.handleMicBtn}><i className="material-icons">mic</i></button>
        </div> 
      </div>
    );
  }
}

export default Controller;

