import React, { Component } from 'react';
import update from 'react-addons-update';
import axios from 'axios';
// get audio file info
import jsmediatags from 'jsmediatags';
// get main/sub color from dataImage
import ColorThief from 'color-thief-standalone';
// toast
import siiimpleToast from 'siiimple-toast';

import Visualizer from './Visualizer';
import Controller from './Controller';
import Header from './Header';
import Lyrics from './Lyrics';
import Playlist from './Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Set up the visualisation elements
      visualizeSet: {
        circle: 2 * Math.PI,
        radius: 200,
        objWidth: 4,
        objCount: 150,
        data: [],
      },
      audioData: {
        src: '',
        album: '',
        title: '',
        artist: '',
        cover: '',
      },
      colors: {
        main: 'rgb(27, 30, 43)',
        sub: 'rgb(229, 206, 208)',
      },
      lyrics: {
        data: [],
        scroll: 0.5,
        show: false,
        find: false,
      },
      playlist: {
        data: [],
        currentPlay: 0,
        show: false,
        random: false,
        repeat: false,
      },
    };
    this.handlePlay = this.handlePlay.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.visualizing = this.visualizing.bind(this);
    this.handleLyricsBtn = this.handleLyricsBtn.bind(this);
    this.findLyrics = this.findLyrics.bind(this);
    this.colorReversal = this.colorReversal.bind(this);
    this.useMic = this.useMic.bind(this);
    this.handleFindLyricsBtn = this.handleFindLyricsBtn.bind(this);
    this.lyricsMounted = this.lyricsMounted.bind(this);
    this.wheelEvent = this.wheelEvent.bind(this);
    this.changeStateColors = this.changeStateColors.bind(this);
    this.changeStateAudioData = this.changeStateAudioData.bind(this);
    this.changeStateLyrics = this.changeStateLyrics.bind(this);
    this.changeStatePlaylist = this.changeStatePlaylist.bind(this);
    this.handlePlaylistBtn = this.handlePlaylistBtn.bind(this);
    this.changeMusic = this.changeMusic.bind(this);
    this.nextMusic = this.nextMusic.bind(this);
    this.prevMusic = this.prevMusic.bind(this);
    this.randomMusic = this.randomMusic.bind(this);
    this.repeatMusic = this.repeatMusic.bind(this);
    this.deleteMusic = this.deleteMusic.bind(this);

    // initialState
    this.initialState = this.state;
    this.initialColor = this.state.colors;

    // Init Settings
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.7;
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    // Init Settings - microphone
    this.acMic = new AudioContext();
    this.anMic = this.acMic.createAnalyser();
    this.anMic.smoothingTimeConstant = 0.7;
    this.anMic.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.anMic.frequencyBinCount);

    // Toast Settiings
    this.toast = new siiimpleToast();
  }
  useMic() {
    navigator.getUserMedia({ audio: true }, (stream) => {
      const audioContext = this.acMic;
      const analyser = this.anMic;
      const microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.connect(audioContext.destination);
    }, (error) => { });
  }
  visualizing() {
    const frequencyData = this.frequencyData;
    const analyser = this.analyser;

    requestAnimationFrame(this.visualizing);

    analyser.getByteFrequencyData(frequencyData);

    // visualiz object height changed
    this.setState({
      visualizeSet: update(
        this.state.visualizeSet, {
          data: { $set: frequencyData },
        },
      ),
    });
  }
  handlePlay(e) {
    const audioContext = this.audioContext;
    const source = audioContext.createMediaElementSource(e.target);
    const analyser = this.analyser;

    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
  fileChange(e) {
    const files = e.target.files;
    const playlist = this.state.playlist.data;

    // update playlist state;
    const whenFinished = () => {
      if (files.length > 0) this.toast.message(`${files.length} songs have been added to the playlist`);

      this.setState({
        playlist: update(
          this.state.playlist, {
            data: { $set: playlist },
          },
        ),
      });

      if (!this.state.audioData.src) {
        this.changeStateAudioData(playlist[this.state.playlist.currentPlay].audioData);
      }
    };

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const dataFile = URL.createObjectURL(file);

      // wrapping Ojbect
      const music = {};

      // read Audio metaData
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          const tags = tag.tags;
          const tagAlbum = tags.album;
          const tagTitle = tags.title;
          const tagArtist = tags.artist;
          let tagCover = tags.picture;

          if (tagCover) {
            // metaData to image
            let base64String = '';
            tagCover.data.forEach((data) => { base64String += String.fromCharCode(data); });
            // base64 dataImage
            tagCover = `data:${tagCover.format};base64,${window.btoa(base64String)}`;
          }

          // set ojbect audioData
          music.audioData = {
            src: dataFile,
            album: tagAlbum,
            title: tagTitle,
            artist: tagArtist,
            cover: tagCover,
          };

          // push to array
          playlist.push(music);

          // when finished
          if (i === files.length - 1) whenFinished();
        },
        // if do not have ID3 tags
        onError: () => {
          music.audioData = {
            src: dataFile,
          };
          playlist.push(music);

          // when finished
          if (i === files.length - 1) whenFinished();
        },
      });
    }// end for
  }
  changeStateColors(image) {
    if (image) {
      const coverImage = new Image();
      coverImage.src = image;
      coverImage.onload = () => {
        // read Color from dataImage
        const colorThief = new ColorThief();
        const colorArray = colorThief.getPalette(coverImage, 2);

        this.setState({
          colors: update(
            this.state.colors, {
              main: { $set: `rgb(${colorArray[1].join(',')})` },
              sub: { $set: `rgb(${colorArray[0].join(',')})` },
            },
          ),
        });
      };
    } else {
      this.setState({ colors: this.initialColor });
    }
  }
  changeStateAudioData(obj) {
    this.setState({
      audioData: update(
        this.state.audioData, {
          src: { $set: obj.src },
          album: { $set: obj.album },
          title: { $set: obj.title },
          artist: { $set: obj.artist },
          cover: { $set: obj.cover },
        },
      ),
    }, () => {
      // reset lyrics State
      this.setState({
        lyrics: update(
          this.state.lyrics, {
            data: { $set: [] },
            show: { $set: false },
            scroll: { $set: 0.5 },
          },
        ),
      });
      // find lyrics
      this.getLyrics(this.state.audioData.artist, this.state.audioData.title);
      // change Colors
      this.changeStateColors(this.state.audioData.cover);
    });
  }
  changeStateLyrics({
    data = this.state.lyrics.data,
    scroll = this.state.lyrics.scroll,
    show = this.state.lyrics.show,
    find = this.state.lyrics.find,
  }) {
    this.setState({
      lyrics: update(
        this.state.lyrics, {
          data: { $set: data },
          scroll: { $set: scroll },
          show: { $set: show },
          find: { $set: find },
        },
      ),
    });
  }
  // when lyrics Component Mounted
  lyricsMounted() {
    const lyrics = document.querySelector('.lyrics');
    lyrics.addEventListener('mousewheel', this.wheelEvent);
    lyrics.addEventListener('DOMMouseScroll', this.wheelEvent);
  }
  wheelEvent(e) {
    // e.deltaY > 0 ? Down : Up
    const deltaY = e.deltaY > 0 ? -3 : 3;
    const currentScroll = this.state.lyrics.scroll;

    if (currentScroll + deltaY <= -100 || currentScroll + deltaY >= 1) {
      this.changeStateLyrics({ scroll: currentScroll });
    } else {
      this.changeStateLyrics({ scroll: currentScroll + deltaY });
    }
  }
  handleLyricsBtn() {
    this.changeStateLyrics({ show: !this.state.lyrics.show });
  }
  colorReversal() {
    this.setState({
      colors: update(
        this.state.colors, {
          main: { $set: this.state.colors.sub },
          sub: { $set: this.state.colors.main },
        },
      ),
    });
  }
  // show form
  handleFindLyricsBtn() {
    this.changeStateLyrics({ find: !this.state.lyrics.find });
  }
  // submit form
  findLyrics(e) {
    e.preventDefault();

    const artist = e.target.elements[0].value;
    const title = e.target.elements[1].value;

    this.getLyrics(artist, title);
  }
  // ajax request to Find Lyrics
  getLyrics(artist, title) {
    // alert
    if (!this.state.lyrics.data) this.toast.message('Only lyrics in English can be searched');
    axios.get(`https://young-savannah-79010.herokuapp.com/lyrics/${artist}/${title}`)
      .then((response) => {
        const data = response.data;

        // update State
        this.changeStateLyrics({ data: data ? data.split('\n') : this.state.lyrics.data });

        if (!data) {
          this.toast.message('Lyrics Not Found!');
        } else {
          this.toast.success('Lyrics Found!');
          // update State
          this.changeStateLyrics({
            show: true,
            find: false,
          });
        }
      });
  }
  changeStatePlaylist({
    data = this.state.playlist.data,
    currentPlay = this.state.playlist.currentPlay,
    show = this.state.playlist.show,
    random = this.state.playlist.random,
    repeat = this.state.playlist.repeat,
  }) {
    this.setState({
      playlist: update(
        this.state.playlist, {
          data: { $set: data },
          currentPlay: { $set: currentPlay },
          show: { $set: show },
          random: { $set: random },
          repeat: { $set: repeat },
        },
      ),
    });
  }
  handlePlaylistBtn() {
    this.changeStatePlaylist({ show: !this.state.playlist.show });
  }
  nextMusic() {
    const currentNum = Number(this.state.playlist.currentPlay);
    let num = currentNum + 1;  // default

    // random
    if (this.state.playlist.random) {
      num = Math.floor(Math.random() * this.state.playlist.data.length);
    }
    // repeat
    if (this.state.playlist.repeat) {
      num = currentNum;
    }

    this.changeMusic(num);
  }
  prevMusic() {
    this.changeMusic(Number(this.state.playlist.currentPlay) - 1);
  }
  changeMusic(num) {
    let number = num;

    if (num === this.state.playlist.data.length) number = 0;
    if (!this.state.playlist.data[number]) return;

    this.changeStateAudioData(this.state.playlist.data[number].audioData);
    this.changeStatePlaylist({ currentPlay: number });
  }
  randomMusic() {
    this.changeStatePlaylist({ random: !this.state.playlist.random });
  }
  repeatMusic() {
    this.changeStatePlaylist({ repeat: !this.state.playlist.repeat });
  }
  deleteMusic(num) {
    const currentPlay = this.state.playlist.currentPlay;

    this.setState({
      playlist: update(
        this.state.playlist, {
          data: { $splice: [[num, 1]] },
          currentPlay: { $set: currentPlay >= num ? currentPlay - 1 : currentPlay },
        },
      ),
    });
  }
  render() {
    const styles = {
      color: this.state.colors.sub,
      backgroundColor: this.state.colors.main,
      backgroundImage: this.state.audioData.cover,
    };
    return (
      <div className="wrapper" style={styles} >
        <Header />
        <Controller
          color={this.state.colors.sub}

          fileChange={this.fileChange}
          handleSubmit={this.findLyrics}

          handleLyricsBtn={this.handleLyricsBtn}
          handleFindLyricsBtn={this.handleFindLyricsBtn}
          handleReversalBtn={this.colorReversal}
          handleMicBtn={this.useMic}

          findLyrics={this.state.lyrics.find}
          showLyrics={this.state.lyrics.show}
        />
        <Visualizer
          class={this.state.lyrics.show ? 'visualizer showLyrics' : 'visualizer'}
          color={this.state.colors.sub}
          data={this.state.audioData}
          settings={this.state.visualizeSet}
          isMounted={this.visualizing}
        />
        <Lyrics
          class={this.state.lyrics.show ? 'lyrics showLyrics' : 'lyrics'}
          color={this.state.colors.main}
          data={this.state.lyrics.data}
          scroll={this.state.lyrics.scroll}
          lyricsMounted={this.lyricsMounted}
        />
        <Playlist
          class={this.state.playlist.show ? 'playlist show' : 'playlist'}
          color={this.state.colors}
          src={this.state.audioData.src}
          playlist={this.state.playlist.data}
          audioData={this.state.audioData}
          useRandom={this.state.playlist.random}
          useRepeat={this.state.playlist.repeat}

          changeMusic={this.changeMusic}
          deleteMusic={this.deleteMusic}
          handlePlaylistBtn={this.handlePlaylistBtn}

          handlePlay={this.handlePlay}
          nextMusic={this.nextMusic}
          prevMusic={this.prevMusic}
          random={this.randomMusic}
          repeat={this.repeatMusic}
        />
      </div>
    );
  }
}
export default App;
