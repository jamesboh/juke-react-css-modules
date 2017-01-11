import React, { Component } from 'react';
import Lyrics from '../components/Lyrics';
import { searchLyrics } from '../action-creators/lyrics';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    text: state.lyrics.text
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchLyrics ({artistQuery, songQuery}) {
      dispatch(searchLyrics(artistQuery, songQuery));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(class extends Component {

  constructor (props) {
    super(props);
    this.state = { artistQuery: '', songQuery: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (type, value) {
    this.setState({ [`${type}Query`]: value });
  }

  handleSubmit (evt) {
    evt.preventDefault();
    if (this.state.artistQuery && this.state.songQuery)
      this.props.searchLyrics(this.state)
  }

  render () {
    return (
      <Lyrics
        {...this.state}
        {...this.props}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
});

