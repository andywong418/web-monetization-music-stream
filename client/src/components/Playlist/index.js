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
        {this.props.currentSong ? null : <h2 style={{textAlign: 'center'}}>Playlist</h2>}
        <ul className="playlist">
          {this.props.songs.map(song => {
            return (
              <li key={song} className="playlist-item">
                <span><i className="fas fa-music"></i></span>
                <a title={song} onClick={this.handleSongSelect}>
                  {song}
                </a>
                {song && song === this.props.currentSong ? <i className="fas fa-volume-up"></i> : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Playlist;
