import React, { Component } from 'react';
import update from 'react-addons-update';
import axios from 'axios';
import Visualizer from './Visualizer';
import Controller from './Controller';
import Header from './Header';
import Lyrics from './Lyrics';
import Playlist from './Playlist/Playlist';
//get audio file info
import jsmediatags from 'jsmediatags';
//get main/sub color from dataImage
import ColorThief from 'color-thief-standalone';
// toast 
import { Toast } from './Toast';

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
        data: []
      },
      audioData: {
        src: '',
        album: '',
        title: '',
        artist: '',
        cover: ''
      },
      colors: {
        main: 'black',
        sub: 'white'
      },
      lyrics: {
        data: [],
        scroll: 0.5,
        show: false,
        find: false
      },
      playlist: {
        data: [],
        currentPlay: 0,
        random: false,
        repeat: false
      }
    }
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
    this.changeState_colors = this.changeState_colors.bind(this);
    this.changeState_audioData = this.changeState_audioData.bind(this);
    this.handlePlaylistBtn = this.handlePlaylistBtn.bind(this);
    this.changeMusic = this.changeMusic.bind(this);
    this.nextMusic = this.nextMusic.bind(this);
    this.prevMusic = this.prevMusic.bind(this);
    this.randomMusic = this.randomMusic.bind(this);
    this.repeatMusic = this.repeatMusic.bind(this);

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
  }
  useMic() {
    navigator.getUserMedia({ audio: true }, (stream) => {
      const audioContext = this.acMic,
        analyser = this.anMic,
        microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.connect(audioContext.destination);
    }, (error) => { console.log(error); });
  }
  visualizing() {
    let frequencyData = this.frequencyData,
      analyser = this.analyser;

    requestAnimationFrame(this.visualizing);

    analyser.getByteFrequencyData(frequencyData);

    // visualiz object height changed
    this.setState({
      visualizeSet: update(
        this.state.visualizeSet, {
          data: { $set: frequencyData }
        }
      )
    });
  }
  handlePlay(e) {
    const audioContext = this.audioContext,
      source = audioContext.createMediaElementSource(e.target),
      analyser = this.analyser;

    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
  fileChange(e) {
    const files = e.target.files,
      playlist = this.state.playlist.data;

    for (let i = 0; i < files.length; i++) {
      let file = files[i],
        dataFile = URL.createObjectURL(file);

      // wrapping Ojbect
      const music = {};

      // read Audio metaData
      jsmediatags.read(file, {
        onSuccess: tag => {
          let tags = tag.tags,
            album = tags.album,
            title = tags.title,
            artist = tags.artist,
            cover = tags.picture;

          if (cover) {
            // metaData to Image 
            let base64String = "";
            cover.data.forEach(data => { base64String += String.fromCharCode(data) });
            // base64 dataImage
            cover = "data:" + cover.format + ";base64," + window.btoa(base64String);
          }

          //set ojbect audioData
          music.audioData = {
            src: dataFile,
            album: album,
            title: title,
            artist: artist,
            cover: cover
          }

          // push to array
          playlist.push(music);

          // when finished
          if (i == files.length - 1) whenFinished();
        },
        // if do not have ID3 tags
        onError: error => {
          music.audioData = {
            src: dataFile
          }
          playlist.push(music);

          // when finished
          if (i == files.length - 1) whenFinished();
        }
      });
    }// end for Loop  

    // update playlist state;
    const whenFinished = () => {
      if (files.length > 0) Toast(`${files.length} songs have been added to the playlist`, 'default');

      this.setState({
        playlist: update(
          this.state.playlist, {
            data: { $set: playlist }
          }
        )
      });

      if (!this.state.audioData.src) this.changeState_audioData(playlist[this.state.playlist.currentPlay].audioData);
    }
  }
  changeState_colors(image) {
    if (image) {
      const coverImage = new Image();
      coverImage.src = image;
      coverImage.onload = () => {
        //read Color from dataImage
        const colorThief = new ColorThief(),
          colorArray = colorThief.getPalette(coverImage, 2);

        this.setState({
          colors: update(
            this.state.colors, {
              main: { $set: 'rgb(' + colorArray[1].join(',') + ')' },
              sub: { $set: 'rgb(' + colorArray[0].join(',') + ')' }
            }
          )
        });
      };
    } else {
      this.setState({ colors: this.initialColor });
    }
  }
  changeState_audioData(obj) {
    this.setState({
      audioData: update(
        this.state.audioData, {
          src: { $set: obj.src },
          album: { $set: obj.album },
          title: { $set: obj.title },
          artist: { $set: obj.artist },
          cover: { $set: obj.cover },
        }
      )
    }, () => {
      // reset lyrics State
      this.setState({
        lyrics: update(
          this.state.lyrics, {
            data: { $set: [] },
            show: { $set: false },
            scroll: { $set: 0.5 }
          }
        )
      });
      // find lyrics
      this.getLyrics(this.state.audioData.artist, this.state.audioData.title);
      // change Colors      
      this.changeState_colors(this.state.audioData.cover);
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
    let deltaY = e.deltaY > 0 ? -3 : 3;

    if (this.state.lyrics.scroll + deltaY <= -100 || this.state.lyrics.scroll + deltaY >= 1) {
      this.setState({
        lyrics: update(
          this.state.lyrics, {
            scroll: { $set: this.state.lyrics.scroll }
          }
        )
      });
    } else {
      this.setState({
        lyrics: update(
          this.state.lyrics, {
            scroll: { $set: this.state.lyrics.scroll + deltaY }
          }
        )
      });
    }
  }
  handleLyricsBtn() {
    this.setState({
      lyrics: update(
        this.state.lyrics, {
          show: { $set: !this.state.lyrics.show }
        }
      )
    });
  }
  colorReversal() {
    this.setState({
      colors: update(
        this.state.colors, {
          main: { $set: this.state.colors.sub },
          sub: { $set: this.state.colors.main }
        }
      )
    });
  }
  // show form
  handleFindLyricsBtn() {
    this.setState({
      lyrics: update(
        this.state.lyrics, {
          find: { $set: !this.state.lyrics.find }
        }
      )
    });
  }
  // submit form
  findLyrics(e) {
    e.preventDefault();

    let artist = e.target.elements[0].value,
      title = e.target.elements[1].value;

    this.getLyrics(artist, title);
  }
  // ajax request to Find Lyrics
  getLyrics(artist, title) {
    // alert
    if (!this.state.lyrics.data) Toast('Only lyrics in English can be searched', 'default');
    axios.get(`https://young-savannah-79010.herokuapp.com/lyrics/${artist}/${title}`)
      .then((response) => {
        let data = response.data;

        // update State
        this.setState({
          lyrics: update(
            this.state.lyrics, {
              data: { $set: data ? data.split('\n') : this.state.lyrics.data }
            }
          )
        });

        if (!data) {
          Toast('Lyrics Not Found!', 'default');
        } else {
          Toast('Lyrics Found!', 'success');
          // update State
          this.setState({
            lyrics: update(
              this.state.lyrics, {
                show: { $set: true },
                find: { $set: false }
              }
            )
          });
        }
      }).catch((error) => { console.log(error); });
  }
  handlePlaylistBtn() {
    this.setState({
      playlist: update(
        this.state.playlist, {
          show: { $set: !this.state.playlist.show }
        }
      )
    });
  }
  nextMusic() {
    let currentNum = Number(this.state.playlist.currentPlay),
      num = currentNum + 1;  // default 

    // random    
    if (this.state.playlist.random)
      num = Math.floor(Math.random() * this.state.playlist.data.length);
    // repeat
    if (this.state.playlist.repeat)
      num = currentNum;

    this.changeMusic(num);
  }
  prevMusic() {
    this.changeMusic(Number(this.state.playlist.currentPlay) - 1);
  }
  changeMusic(num) {
    if (!this.state.playlist.data[num] || this.state.playlist.data.length === 1) return;

    this.changeState_audioData(this.state.playlist.data[num].audioData);
    this.setState({
      playlist: update(
        this.state.playlist, {
          currentPlay: { $set: num }
        }
      )
    });
  }
  randomMusic() {
    this.setState({
      playlist: update(
        this.state.playlist, {
          random: { $set: !this.state.playlist.random }
        }
      )
    })
  }
  repeatMusic() {
    this.setState({
      playlist: update(
        this.state.playlist, {
          repeat: { $set: !this.state.playlist.repeat }
        }
      )
    })
  }
  render() {
    const styles = {
      color: this.state.colors.sub,
      backgroundColor: this.state.colors.main,
      backgroundImage: this.state.audioData.cover
    }
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