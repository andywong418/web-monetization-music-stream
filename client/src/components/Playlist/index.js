import React, { Component } from "react";

class Playlist extends Component {

  handleSongSelect = e => {
    e.preventDefault();
    const newSong = e.target.title;
    this.props.onSelectSong(newSong);
  };

  render() {
    return (
      <div className="playlist-wrapper">
        <h2>Playlist</h2>
        <ul className="playlist">
          {this.props.songs.map(song => {
            return (
              <li key={song} className="playlist-item">
                <a title={song} onClick={this.handleSongSelect}>
                  {song}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Playlist;
