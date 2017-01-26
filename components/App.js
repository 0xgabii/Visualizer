import React, { Component } from 'react';
import update from 'react-addons-update';
import Visualizer from './Visualizer';
import Controller from './Controller';
//get audio file info
import jsmediatags from 'jsmediatags';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: "//katiebaca.com/tutorial/odd-look.mp3",
      // Set up the visualisation elements
      visualizeSet: {
        circle: 2 * Math.PI,
        radius: 170,
        objWidth: 2,
        objCount: 250,
        data: []
      },
      audioData: {
        album: '',
        title: '',
        cover: '',
        artist: ''
      }
    }
    this.handlePlay = this.handlePlay.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.visualizing = this.visualizing.bind(this);

    // Init Settings
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
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
    let audioContext = this.audioContext,
      source = audioContext.createMediaElementSource(e.target),
      analyser = this.analyser;

    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
  fileChange(e) {
    let _this = this,
      file = e.target.files[0],
      dataFile = URL.createObjectURL(file);

    jsmediatags.read(file, {
      onSuccess: function (tag) {
        let tags = tag.tags,
          album = tags.album,
          title = tags.title,
          artist = tags.artist,
          cover = tags.picture;

        // metaData to Image 
        let base64String = "";
        for (let i = 0; i < cover.data.length; i++) {
          base64String += String.fromCharCode(cover.data[i]);
        }
        // base64 dataImage
        cover = "data:" + cover.format + ";base64," + window.btoa(base64String);

        _this.setState({
          audioData: update(
            _this.state.audioData, {
              album: { $set: album },
              title: { $set: title },
              artist: { $set: artist },
              cover: { $set: cover }
            }
          )
        });
      },
      onError: function (error) {
        console.log(':(', error.type, error.info);
      }
    });



    this.setState({ src: dataFile });
  }
  render() {
    return (
      <div>
        <Controller
          handlePlay={this.handlePlay}
          src={this.state.src}
          fileChange={this.fileChange}
          />
        <Visualizer
          isMounted={this.visualizing}
          settings={this.state.visualizeSet}
          data={this.state.audioData}
          />
      </div>
    );
  }
}

export default App;