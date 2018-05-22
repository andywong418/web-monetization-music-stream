import React, { Component } from "react";
import AudioPlayer from "../components/AudioPlayer/";
import Playlist from "../components/Playlist";
import Header from "../components/Header";
import Footer from '../components/Footer';
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
    console.log("this state", this.state.songs, currentSongIndex);
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
        <Header />
        <div className="text-center">
            <h1 className="jumbotron-heading" style={{marginTop: '50px'}}><img src="" /> Music Streamer</h1>
            <p className="lead text-muted showoff">This is a demo music streamer to show off the capabilities of <a href="https://github.com/interledger/rfcs/blob/master/0028-web-monetization/0028-web-monetization.md">Web Monetization</a> and <a href="https://interledger.org">Interledger</a>.</p>
            <p className="lead text-muted turn"> Turn on your extensions and start listening to quality music whilst contributing to artists!</p>
        </div>
        <div className="app-wrapper col-md-6 col-sm-10 col-xs-10">
          <AudioPlayer
            src={"/music?id=" + this.state.currentSong}
            title={this.state.currentSong}
            currentSong={this.state.currentSong}
            playNextTrack={this.playNextTrack}
            autoPlay={this.state.autoPlay}
            durationUpdate={this.state.durationUpdate}
            turnOffDurationUpdate={this.state.turnOffDurationUpdate}
          />
          <Playlist onSelectSong={this.handleSongSelect} songs={this.state.songs} currentSong={this.state.currentSong}/>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
