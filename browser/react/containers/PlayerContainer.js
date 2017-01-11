import React, { Component } from 'react';
import AUDIO from '../audio';
import { previous, next, setProgress, toggleSong } from '../action-creators/player';
import Player from '../components/Player';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const player = state.player;

  return {
    currentSong: player.currentSong,
    currentSongList: player.currentSongList,
    isPlaying: player.isPlaying,
    progress: player.progress
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    prev () {
      dispatch(previous());
    },
    next () {
      dispatch(next());
    },
    toggle (currentSong, currentSongList) {
      dispatch(toggleSong(currentSong, currentSongList))
    },
    setProgress () {
      dispatch(setProgress(AUDIO.currentTime / AUDIO.duration))
    }

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(class extends Component {

  componentDidMount () {
    AUDIO.addEventListener('ended', this.props.next);
    AUDIO.addEventListener('timeupdate', () => {
      this.props.setProgress(AUDIO.currentTime / AUDIO.duration);
    });
  }

  render () {
    return <Player {...this.props} />
  }
});

