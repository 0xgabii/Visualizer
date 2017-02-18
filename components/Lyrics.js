import React, { Component } from 'react';

class Lyrics extends Component {
  componentDidMount() {
    this.props.lyricsMounted();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props;
  }
  render() {
    const style = {
      background: this.props.color,
    };
    const scroll = {
      transform: `translateY(${this.props.scroll}%)`,
    };
    return (
      <div style={style} className={this.props.class} >
        <div style={scroll}>
          {this.props.data.map((data, i) => <p key={i}>{data}</p>)}
        </div>
      </div>
    );
  }
}
export default Lyrics;
