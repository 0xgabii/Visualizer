import React from 'react';

const FindLyrics = (props) => {
    return (
        <div className={props.class}>
            <h3>Find lyrics with Artist and Title</h3>
            <form onSubmit={props.handleSubmit}>            
                <input type="text" name="artist" placeholder="artist" required />
                <input type="text" name="title" placeholder="title" required />
                <button type="submit">Find</button>
            </form>
        </div>
    );
};

export default FindLyrics;