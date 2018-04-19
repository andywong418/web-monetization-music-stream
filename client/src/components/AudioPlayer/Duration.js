import React, { Component } from "react";
import { withMediaProps, utils } from "react-media-player";



class Duration extends Component {

  render() {
    const { className, style, media } = this.props
    return (
      <time className={className} style={style}>

        {utils.formatTime(this.props.duration)}
      </time>
    )
  }
}

export default withMediaProps(Duration)
