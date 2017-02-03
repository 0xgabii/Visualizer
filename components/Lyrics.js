import React, { Component } from 'react';

class Lyrics extends Component {
    componentDidMount() {
        this.props.lyricsMounted();        
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
            transform: `translateY(${this.props.scroll}%)`
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