import React from 'react';

const Playlist = (props) => {
  return (
    <div className={props.class} onClick={props.handlePlaylistBtn}>
      <NowPlaying 
        class="nowPlaying"
        data={props.audioData} 
        />
      {props.playlist.map((data, i) => {
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
};

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

const NowPlaying = (props) => {
  return (
    <div className={props.class}>
      <img className={props.class + '-cover'} src={props.data.cover} />
      <div className={props.class + '-infoBox'}>
        <span className={props.class + '-title'}>{props.data.title}</span>
        <span className={props.class + '-artist'}>{props.data.artist}</span>
        <span className={props.class + '-album'}>{props.data.album}</span>
      </div>
    </div>
  );
};

export default Playlist;