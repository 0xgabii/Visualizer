import React, { Component } from 'react';

class Controller extends Component {
  constructor(props) {
    super(props);
    this.selectMusic = this.selectMusic.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props;
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
      opacity: 0,
    };
    const btn = {
      border: `1px solid ${this.props.color}`,
      color: this.props.color,
    };
    return (
      <div className="music-controller">
        <input
          id="audioFile"
          type="file"
          accept="audio/*"
          multiple
          style={invisible}
          onChange={this.props.fileChange}
        />
        <div className="btnGroup__controller">
          <button
            style={btn}
            onClick={this.selectMusic}
          >Open files</button>
          <button
            style={btn}
            onClick={this.props.handleLyricsBtn}
          >{this.props.showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}</button>
          <button
            style={btn}
            onClick={this.props.handleFindLyricsBtn}
          >{this.props.findLyrics ? 'Close' : 'Find Lyrics'}</button>
          <button
            style={btn}
            onClick={this.props.handleReversalBtn}
          >Color reversal</button>
          <button
            style={btn}
            onClick={this.props.handleMicBtn}
          >Karaoke Mode (Not yet - v1.3 )</button>
        </div>
        <form
          onSubmit={this.props.handleSubmit}
          className={this.props.findLyrics ? 'findLyrics show' : 'findLyrics'}
        >
          <input type="text" name="artist" placeholder="artist" required />
          <input type="text" name="title" placeholder="title" required />
          <button type="submit">Find</button>
        </form>
      </div>
    );
  }
}

export default Controller;

