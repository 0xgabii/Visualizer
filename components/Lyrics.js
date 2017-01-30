import React, { Component } from 'react';

class Lyrics extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props;
    }
    render() {
        let lyrics = [],
            newData = this.props.data;
        newData.forEach((value, i) => { lyrics.push(<h1>{value}</h1>) });

        return (
            <div className={this.props.class} >
                {lyrics}
            </div>
        );
    }
}

export default Lyrics;