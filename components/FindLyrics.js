import React from 'react';

const FindLyrics = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <input type="text" name="artist" placeholder="artist" required />
            <input type="text" name="title" placeholder="title" required />
            <button type="submit">Find Lyrics</button>
        </form>
    );
};

export default FindLyrics;