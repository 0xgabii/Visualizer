import React, { Component } from 'react';

class Visualizer extends Component {
  componentDidMount() {
    this.props.isMounted();
  }
  componentDidUpdate() {
    const newData = this.props.settings.data;
    const visualizerScale = newData.length ? (newData.reduce((prev, curr, i) => prev + curr) / newData.length / 750) + 1 : 1;

    if (visualizerScale > 1) {
      document.getElementById('visualizer').style.transform = `scale(${visualizerScale})`;
    }
  }
  render() {
    // style settings
    const radius = this.props.settings.radius;
    const cover = this.props.data.cover;

    // obj visual sets
    const newData = this.props.settings.data;
    const visualObj = [];
    const objWidth = this.props.settings.objWidth;
    const color = this.props.color;
    const circle = this.props.settings.circle;
    const step = this.props.settings.circle / this.props.settings.objCount;

    const circleStyle = {
      width: (radius * 2) - 20,
      height: (radius * 2) - 20,
      backgroundImage: `url(${cover})`,
    };

    for (let deg = 0, i = 0; deg < circle; deg += step, i += 1) {
      const x = radius * Math.cos(deg);
      const y = radius * Math.sin(deg);
      const rad = deg - 1.57;// minus 90deg

      const styles = {
        left: x,
        top: y,
        height: 10 + (newData[i] * 0.35),
        width: objWidth,
        backgroundColor: color,
        transform: `rotate(${rad}rad)`,
      };

      visualObj.push(
        <div key={i} style={styles} />,
      );
    }

    return (
      <div id="visualizer" className={this.props.class}>
        <div id="innerCircle" style={circleStyle} />
        {visualObj}
      </div>
    );
  }
}
export default Visualizer;
