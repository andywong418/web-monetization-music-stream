import React, { Component } from "react";
import { Media, Player, controls } from "react-media-player";
import PlayPause from "./PlayPause";
import MuteUnmute from "./MuteUnmute";
import Duration from './Duration';
import SeekBar from './Seekbar';
const { CurrentTime, Volume } = controls;

const CurrentTitle = props => <h2>{props.title || "Select Song"}</h2>;

class AudioPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      duration: Infinity,
      durationUpdate: false,
      songTitle: this.props.title
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.songTitle !== this.state.songTitle) {
      // Update duration
      let self = this;
      fetch("/duration?id=" + nextProps.title)
        .then(response => response.json())
        .then(data => {
            self.setState({duration: data.duration, songTitle: nextProps.title});
        })
    }
  }
  // shouldDurationUpdate = () => {
  //   this.setState({ duration: Infinity });
  // }
  render() {
    if (!this.props.title) {
      return (
        <div className="player-wrapper">
        </div>
      );
    }
    // Parse paymentPointer and then pay out accordingly by window.monetizing here.
    return (
      <Media>
        <div className="player-wrapper">
          <Player ref={c => (this._player = c)} src={this.props.src} autoPlay={this.props.autoPlay}/>
          <div className="media-controls">
            <CurrentTitle title={this.props.title} />
            <PlayPause className="media-control media-control--play-pause" />
            <div className="media-time-controls">
              <CurrentTime className="media-control media-control--current-time" />
              <SeekBar className="media-control media-control--volume-range" title={this.props.title}  duration={this.state.duration} playNextTrack={this.props.playNextTrack} songTitle={this.state.songTitle}/>
              {this.props.currentSong? <Duration className="media-control media-control--duration" title={this.props.title} duration={this.state.duration}/> : null}
            </div>
            <div className="media-volume-control">
              <MuteUnmute className="media-control media-control--mute-unmute" />
              <Volume className="media-control media-control--volume"/>
            </div>
          </div>
        </div>
      </Media>
    );
  }
}

export default AudioPlayer;
