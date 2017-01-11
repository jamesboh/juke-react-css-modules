import Playlist from '../components/Playlist';
import {toggleSong} from '../action-creators/player';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    selectedPlaylist: state.playlists.selected
  };
};

export default connect(mapStateToProps)(Playlist);
