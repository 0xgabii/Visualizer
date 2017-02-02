import React, { Component } from 'react';

class Lyrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scroll: 0.5
        }
        this.wheelEvent = this.wheelEvent.bind(this);
    }
    componentDidMount() {
        const lyrics = document.querySelector('.lyrics');
        lyrics.addEventListener('mousewheel', this.wheelEvent);
        lyrics.addEventListener('DOMMouseScroll', this.wheelEvent);
    }
    wheelEvent(e) {
        // e.deltaY > 0 ? Down : Up
        let deltaY = e.deltaY > 0 ? -3 : 3;

        if (this.state.scroll + deltaY <= -100 || this.state.scroll + deltaY >= 1) {
            this.setState({ scroll: this.state.scroll });
        } else {
            this.setState({ scroll: this.state.scroll + deltaY });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props;
    }
    render() {
        let lyrics = [],
            newData = this.props.data;
        const style = {
            background: this.props.color
        }, scroll = {
            transform: `translateY(${this.state.scroll}%)`
        }
        newData.forEach((value, i) => { lyrics.push(<p key={i}>{value}</p>) });
        return (
            <div style={style} className={this.props.class} >
                <div style={scroll} >{lyrics}</div>
            </div>
        );
    }
}

export default Lyrics;