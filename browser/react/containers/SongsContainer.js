import { connect } from 'react-redux';
import { toggleSong } from '../action-creators/player';
import Songs from '../components/Songs';

const mapStateToProps = (state, ownProps) => {
  const player = state.player;

  return {
    songs: ownProps.songs,
    currentSong: player.currentSong,
    isPlaying: player.isPlaying
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleOne (song, list) {
      dispatch(toggleSong(song, list));
    }
  }
}

export default (connect)(
  mapStateToProps,
  mapDispatchToProps
)(Songs);
