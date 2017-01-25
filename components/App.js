import React, { Component } from 'react';
import update from 'react-addons-update';
import Visualizer from './Visualizer';
import Controller from './Controller';

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
        objCount: 200,
        data: []
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

    this.setState({
      visualizeSet : update(
        this.state.visualizeSet,{
          data: {$set: frequencyData}
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
    let file = e.target.files[0],
      dataFile = URL.createObjectURL(file);

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
          />
      </div>
    );
  }
}

export default App;