import React, { Component } from "react";
import { Media, Player, controls } from "react-media-player";
import PlayPause from "./PlayPause";
import MuteUnmute from "./MuteUnmute";

const { CurrentTime, SeekBar, Duration, Volume } = controls;

const CurrentTitle = props => <h1>{props.title || "Select Song"}</h1>;

class AudioPlayer extends Component {
  render() {
    if (!this.props.title) {
      return (
        <div className="player-wrapper">
          <h1>select song to begin</h1>
        </div>
      );
    }

    return (
      <Media>
        <div className="player-wrapper">
          <Player ref={c => (this._player = c)} src={this.props.src} />
          <div className="media-controls">
            <CurrentTitle title={this.props.title} />
            <PlayPause className="media-control media-control--play-pause" />
            <CurrentTime className="media-control media-control--current-time" />
            <SeekBar className="media-control media-control--volume-range" />
            <Duration className="media-control media-control--duration" />
            <Volume className="media-control media-control--volume" />
            <MuteUnmute className="media-control media-control--mute-unmute" />
          </div>
        </div>
      </Media>
    );
  }
}

export default AudioPlayer;
