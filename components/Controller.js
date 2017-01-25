import React, { Component } from 'react';

class Controller extends Component {
  render() {
    return (
      <div>
        <div className="music-controller">
          <input type="file" accept="audio/*"
            onChange={this.props.fileChange} 
          />
          <audio crossOrigin="anonymous" controls
            src={this.props.src}
            onCanPlayThrough={this.props.handlePlay}
          ></audio>
        </div>
      </div>
    );
  }
}

export default Controller;