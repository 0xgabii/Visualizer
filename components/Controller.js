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
    const btn = {
      border: '1px solid ' + this.props.color,
      color: this.props.color
    }
    return (
      <div className="music-controller">
        <input style={invisible} id="audioFile" type="file" accept="audio/*"
          onChange={this.props.fileChange}
          />
        <div className="btnGroup__controller">          
          <button style={btn} onClick={this.selectMusic}>Open file</button>
          <audio crossOrigin="anonymous" controls
            src={this.props.src}
            onLoadedData={this.props.handlePlay}
            onTimeUpdate={this.props.timeUpdate}
            ></audio>
          <button style={btn} onClick={this.props.handleLyricsBtn}>{this.props.lyricsBtnText}</button>
          <button style={btn} onClick={this.props.handleFindLyricsBtn}>{this.props.findLyricsBtnText}</button>
          <button style={btn} onClick={this.props.handleReversalBtn}>Color reversal</button>
          <button style={btn} onClick={this.props.handleMicBtn}>Karaoke Mode (Not yet - v1.3 )</button>
        </div>
      </div>
    );
  }
}

export default Controller;

