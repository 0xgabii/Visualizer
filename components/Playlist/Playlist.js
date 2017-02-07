import React, { Component } from 'react';
import NowPlaying from './NowPlaying';
import Control from './Control';
import Item from './listitem';

class Playlist extends Component {
  handleClick(num, obj) {
    this.props.changeMusic(num);
  }
  render() {
    const style = {
      backgroundColor: this.props.color.sub,
      color: this.props.color.main
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
        <Control
          class="playlistControl" 
        />
        <div className="playlist__item-wrapper">
          {this.props.playlist.map((data, i) => {
            const style = {
              transitionDelay: i < 10 ? i / 13 + 's' : '0s'
            }
            return (
              <Item
                key={i}
                class="playlist__item"
                album={data.audioData.album}
                title={data.audioData.title}
                artist={data.audioData.artist}
                cover={data.audioData.cover}
                css={style}
                onClick={this.handleClick.bind(this, i)}
              />
            )
          })}
        </div>
      </div>
    );
  }
}

export default Playlist;