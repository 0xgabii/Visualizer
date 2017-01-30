import React, { Component } from 'react';

class Visualizer extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.isMounted();
  }
  componentDidUpdate() {
    let newData = this.props.settings.data,
      visualizerScale = newData.reduce((prev, curr, i) => prev + curr) / newData.length / 750 + 1;

    if (visualizerScale > 1) {
      document.getElementById('visualizer').style.transform = `scale(${visualizerScale})`;
    }
  }
  render() {
    // style settings
    let radius = this.props.settings.radius,
      cover = this.props.data.cover;

    // obj visual sets
    let newData = this.props.settings.data,
      visualObj = [],
      objWidth = this.props.settings.objWidth,
      color = this.props.color,
      circle = this.props.settings.circle,
      step = this.props.settings.circle / this.props.settings.objCount;

    const circleStyle = {
      width: radius * 2 - 20,
      height: radius * 2 - 20,
      backgroundImage: 'url(' + cover + ')'
    }

    for (let deg = 0, i = 0; deg < circle; deg += step, i++) {

      let x = radius * Math.cos(deg),
        y = radius * Math.sin(deg),
        rad = deg - 1.57;// minus 90deg

      const styles = {
        left: x,
        top: y,
        height: 10 + newData[i] / 3,
        width: objWidth,
        backgroundColor: color,
        transform: 'rotate(' + rad + 'rad)'
      };

      visualObj.push(
        <div style={styles} ></div>
      )
    }

    return (
      <div id="visualizer" className={this.props.class}>
        <div id="innerCircle" style={circleStyle} ></div>
        {visualObj}
      </div>
    );
  }
}

export default Visualizer;