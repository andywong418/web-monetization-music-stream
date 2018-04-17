import React, { Component } from "react";
import AudioPlayer from "../components/AudioPlayer/";
import Playlist from "../components/Playlist";

class App extends Component {
  state = {
    currentSong: ""
  };

  handleSongSelect = song => {
    this.setState({ currentSong: song });
  };

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
          />
          <Playlist onSelectSong={this.handleSongSelect} />
        </div>
      </div>
    );
  }
}

export default App;
