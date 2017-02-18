import React, { Component } from 'react';
import NowPlaying from './NowPlaying';
import Control from './Control';
import Progress from './Progress';
import Item from './Listitem';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      duration: 0,
      currentTime: 0,
    };
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.musicPlayControl = this.musicPlayControl.bind(this);
    this.progress = this.progress.bind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    const audio = document.getElementById('audio');
    audio.duration > 0 && nextState.playing ? audio.play() : audio.pause();
  }
  onTimeUpdate(e) {
    this.setState({
      duration: audio.duration,
      currentTime: e.target.currentTime,
    });
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
  progress(e) {
    const audio = document.getElementById('audio');

    const mouseX = e.clientX;
    const progressX = e.target.getBoundingClientRect().left;
    const progressWidth = e.target.offsetWidth;
    const progress = e.target.offsetWidth / (mouseX - progressX);

    this.setState({
      currentTime: this.state.duration / progress,
    }, () => {
      audio.currentTime = this.state.currentTime;
    });
  }
  render() {
    const invisible = {
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: 0,
    };
    const progress = {
      backgroundColor: this.props.color.sub,
      width: `${Math.round((this.state.currentTime / this.state.duration) * 100)}%`,
    };
    return (
      <div className={this.props.class}>
        <div
          className="backdrop"
          onClick={this.props.handlePlaylistBtn}
        />
        <NowPlaying
          class="nowPlaying"
          data={this.props.audioData}
          onClick={this.props.handlePlaylistBtn}
        />
        <audio
          id="audio"
          crossOrigin="anonymous"
          controls
          style={invisible}
          src={this.props.src}
          onEnded={this.props.nextMusic}
          onTimeUpdate={this.onTimeUpdate}
          onLoadedData={this.props.handlePlay}
        />
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
          musicPlayControl={this.musicPlayControl}
        />
        <Progress
          class="playlist__progress"
          onClick={this.progress}
          style={progress}
        />
        <div className="playlist__item-wrapper">
          {this.props.playlist.map((data, i) => {
            const style = {
              transitionDelay: i < 10 ? `${i / 13}s` : '0s',
            };
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
            );
          })}
        </div>
      </div >
    );
  }
}
export default Playlist;
