import React, { Component } from "react";
import AudioPlayer from "../components/AudioPlayer/";
import Playlist from "../components/Playlist";

class App extends Component {
  state = {
    currentSong: "",
    songs: [],
    autoPlay: false,
  };

  handleSongSelect = song => {
    this.setState({ currentSong: song });
  };

  playNextTrack = () => {
    //
    const currentSongIndex = this.state.songs.indexOf(this.state.currentSong);
    if(currentSongIndex + 1 < this.state.songs.length) {
      this.setState({ currentSong: this.state.songs[currentSongIndex + 1], autoPlay: true, durationUpdate: true });
    }

  }

  componentDidMount() {
    fetch("/playlist", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        const previousSongs = this.state.songs;
        const updatedSongs = previousSongs.concat(data);

        return this.setState({ songs: updatedSongs });
      });
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Paya Playa Tuna</h1>
        </header>
        <div className="app-wrapper">
          <AudioPlayer
            src={"/music?id=" + this.state.currentSong}
            title={this.state.currentSong}
            currentSong={this.state.currentSong}
            playNextTrack={this.playNextTrack}
            autoPlay={this.state.autoPlay}
            durationUpdate={this.state.durationUpdate}
            turnOffDurationUpdate={this.state.turnOffDurationUpdate}
          />
          <Playlist onSelectSong={this.handleSongSelect} songs={this.state.songs}/>
        </div>
      </div>
    );
  }
}

export default App;
