import React, { Component } from 'react';

class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.circle = this.props.settings.circle;
    this.radius = this.props.settings.radius;
    this.objWidth = this.props.settings.objWidth;
    this.objCount = this.props.settings.objCount;
    this.step = this.props.settings.circle / this.props.settings.objCount;
    this.data = this.props.settings.data;
  }
  componentDidMount() {
    //this.props.isMounted();
  }
  componentDidUpdate() {

    const objects = document.querySelectorAll('#visualizer > div:not(#innerCircle)');

    var avg = this.data.reduce((prev, curr, i) => prev + curr) / this.data.length;

    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      obj.style.height = 10 + this.data[i] / 3;
    }

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

    let visualObj = [];

    for (let deg = 0; deg < this.circle; deg += this.step) {
      let x = this.radius * Math.cos(deg),
        y = this.radius * Math.sin(deg),
        rad = deg - 1.57,//minus 90deg
        styles = {
          left: x,
          top: y,
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