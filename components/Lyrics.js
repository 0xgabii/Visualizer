import React, { Component } from 'react';

class Lyrics extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data !== this.props.data;
    }
    render() {
        let lyrics = [],
            newData = this.props.data;

        newData.forEach((value, i) => {
            lyrics.push(
                <h3>{value}</h3>
            )
        });
        return (
            <div className="lyrics">
                {lyrics}
            </div>
        );
    }
}

export default Lyrics;