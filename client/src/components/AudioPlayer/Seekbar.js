import React, { Component } from "react";
import { withMediaProps, utils } from "react-media-player";


class SeekBar extends Component {
  constructor(props) {
    super(props);
    this._isPlayingOnMouseDown = false
    this._onChangeUsed = false
  }

  shouldComponentUpdate({ media }) {
    return (
      this.props.media.currentTime !== media.currentTime
    )
  }

  _handleMouseDown = () => {
    this._isPlayingOnMouseDown = this.props.media.isPlaying
    this.props.media.pause()
  }

  _handleMouseUp = ({ target: { value } }) => {
    // seek on mouseUp as well because of this bug in <= IE11
    // https://github.com/facebook/react/issues/554
    if (!this._onChangeUsed) {
      this.props.media.seekTo(+value)
    }

    // only play if media was playing prior to mouseDown
    if (this._isPlayingOnMouseDown) {
      this.props.media.play()
    }
  }

  _handleChange = ({ target: { value } }) => {
    this.props.media.seekTo(+value)
    this._onChangeUsed = true
  }

  componentWillReceiveProps(nextProps) {
    const { className, style, media } = nextProps;
    const { currentTime } = media;
    if(currentTime >= this.props.duration - 1) {
      // change next Track

      this.props.playNextTrack();
    }
  }
  render() {
    const { className, style, media } = this.props
    const { currentTime } = media
    return (
      <input
        type="range"
        step="any"
        max={this.props.duration.toFixed(4)}
        value={currentTime}
        onMouseDown={this._handleMouseDown}
        onMouseUp={this._handleMouseUp}
        onChange={this._handleChange}
        className={className}
        style={{
          backgroundSize: currentTime * 100 / this.props.duration + '% 100%',
          ...style,
        }}
      />
    )
  }
}


export default withMediaProps(SeekBar)
