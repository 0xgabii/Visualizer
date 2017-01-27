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
      avg = newData.reduce((prev, curr, i) => prev + curr) / newData.length;

    /*
      var avg = tot / objCount / 100 - 0.25;
 
      if (avg > 1) {
        parent.css({ 'transform': 'translate(-50%,-50%) scale(' + avg + ')' });
      }
    */
  }
  render() {
    // style settings
    let radius = this.props.settings.radius,
      cover = this.props.data.cover;

    const circleStyle = {
      width: radius * 2 - 20,
      height: radius * 2 - 20,
      backgroundImage: 'url(' + cover + ')'
    }

    // obj visual sets
    let newData = this.props.settings.data,
      visualObj = [],
      objWidth = this.props.settings.objWidth,
      circle = this.props.settings.circle,
      step = this.props.settings.circle / this.props.settings.objCount;

    for (let deg = 0, i = 0; deg < circle; deg += step, i++) {

      let x = radius * Math.cos(deg),
        y = radius * Math.sin(deg),
        rad = deg - 1.57;// minus 90deg

      const styles = {
        left: x,
        top: y,
        height: 10 + newData[i] / 3,
        width: objWidth,
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