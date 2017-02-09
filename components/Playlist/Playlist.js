import React, { Component } from 'react';
import NowPlaying from './NowPlaying';
import Control from './Control';
import Item from './listitem';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      duration: 0,
      currentTime: 0
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const audio = document.getElementById('audio');
    audio.duration > 0 && nextState.playing ? audio.play() : audio.pause();
  }
  itemClick(num, obj) {
    this.props.changeMusic(num);
  }
  deleteItem(num, obj) {
    this.props.deleteMusic(num);
  }
  musicPlayControl() {
    this.setState({ playing: !this.state.playing });
  }
  onTimeUpdate(e) {
    this.setState({
      duration: audio.duration,
      currentTime: e.target.currentTime
    });
  }
  progress(e) {
    const audio = document.getElementById('audio');

    let mouseX = e.clientX,
      progressX = e.target.getBoundingClientRect().left,
      progressWidth = e.target.offsetWidth,
      progress = e.target.offsetWidth / (mouseX - progressX),
      currentTime = this.state.duration / progress;

    this.setState({
      currentTime: currentTime
    }, () => {
      audio.currentTime = this.state.currentTime;
    });
  }
  render() {
    const invisible = {
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: 0
    }
    const progress = {
      backgroundColor: this.props.color.sub,
      width: Math.round(this.state.currentTime / this.state.duration * 100) + '%'
    }
    return (
      <div className={this.props.class}>
        <div
          className="backdrop"
          onClick={this.props.handlePlaylistBtn}>
        </div>
        <NowPlaying
          class="nowPlaying"
          data={this.props.audioData}
          onClick={this.props.handlePlaylistBtn}
        />
        <audio id="audio" crossOrigin="anonymous" controls
          style={invisible}
          src={this.props.src}
          onEnded={this.props.nextMusic}
          onTimeUpdate={this.onTimeUpdate.bind(this)}
          onLoadedData={this.props.handlePlay}
        ></audio>
        <Control
          class="playlistControl"
          playing={this.state.playing}
          color={this.props.color}
          random={this.props.random}
          repeat={this.props.repeat}
          useRandom={this.props.useRandom}
          useRepeat={this.props.useRepeat}
          nextMusic={this.props.nextMusic}
          prevMusic={this.props.prevMusic}
          musicPlayControl={this.musicPlayControl.bind(this)}
        />
        <div className="playlist__progress" onClick={this.progress.bind(this)} >
          <div style={progress}></div>
        </div>
        <div className="playlist__item-wrapper">
          {this.props.playlist.map((data, i) => {
            const style = {
              transitionDelay: i < 10 ? i / 13 + 's' : '0s'
            }
            return (
              <Item
                key={i}
                class="playlist__item"
                css={style}
                album={data.audioData.album}
                title={data.audioData.title}
                artist={data.audioData.artist}
                cover={data.audioData.cover}
                onClick={this.itemClick.bind(this, i)}
                deleteItem={this.deleteItem.bind(this, i)}
              />
            )
          })}
        </div>
      </div>
    );
  }
}

export default Playlist;