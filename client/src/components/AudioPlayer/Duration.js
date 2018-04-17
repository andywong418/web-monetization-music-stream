import React, { Component } from "react";
import { withMediaProps, utils } from "react-media-player";



class Duration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      duration: 0
    }
  }
  componentDidMount() {
    let self = this;
    fetch("/duration?id=" + this.props.title)
      .then(response => response.json())
      .then(data => {
          self.setState({duration: data.duration});
      })
  }
  render() {
    const { className, style, media } = this.props
    return (
      <time className={className} style={style}>

        {utils.formatTime(this.state.duration)}
      </time>
    )
  }
}

export default withMediaProps(Duration)
