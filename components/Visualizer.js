import React, { Component } from 'react';

class Visualizer extends Component {
  constructor(props) {
    super(props);

    this.settings = this.props.settings;
    this.circle = this.settings.circle;
    this.radius = this.settings.radius;
    this.objWidth = this.settings.objWidth;
    this.objCount = this.settings.objCount;
    this.step = this.settings.circle / this.settings.objCount;
  }
  componentDidMount() {
    this.props.isMounted();
  }
  componentDidUpdate() {
    let newData = this.props.settings.data,
      avg = newData.reduce((prev, curr, i) => prev + curr) / newData.length;

    /*
      var avg = tot / objCount / 100 - 0.25;
 
      if (avg > 1) {
        parent.css({ 'transform': 'translate(-50%,-50%) scale(' + avg + ')' });
      }
    */
  }
  render() {
    let circleStyle = {
      width: this.radius * 2 - 20,
      height: this.radius * 2 - 20
    }

    let newData = this.props.settings.data

    let visualObj = [];

    for (let deg = 0; deg < this.circle; deg += this.step) {
      let x = this.radius * Math.cos(deg),
        y = this.radius * Math.sin(deg),
        rad = deg - 1.57,//minus 90deg
        styles = {
          left: x,
          top: y, 
          height: 10 + newData[Math.floor(deg/this.step)]/3,
          width: this.objWidth,
          transform: 'rotate(' + rad + 'rad)'
        };

      visualObj.push(
        <div style={styles} ></div>
      )
    }

    return (
      <div>
        <div id="visualizer">
          <div id="innerCircle" style={circleStyle} ></div>
          {visualObj}
        </div>
      </div>
    );
  }
}

export default Visualizer;