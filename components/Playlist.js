import React, { Component } from 'react';

class Playlist extends Component {
  render() {
    return (
      <div className={this.props.class}>
        {this.props.data.map((data, i) => {
          return (
            <Item
              class="playlist__item"
              album={data.audioData.album}
              title={data.audioData.title}
              artist={data.audioData.artist}
              cover={data.audioData.cover}
            />
          )
        })}
      </div>
    );
  }
}

const Item = (props) => {
  return (
    <div className={props.class}>
      <img className={props.class + '-cover'} src={props.cover} />
      <div className={props.class + '-infoBox'}>
        <span className={props.class + '-title'}>{props.title}</span>
        <span className={props.class + '-artist'}>{props.artist}</span>
        <span className={props.class + '-album'}>{props.album}</span>
      </div>
    </div>
  );
};

export default Playlist;