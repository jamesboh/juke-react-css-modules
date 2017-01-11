import Album from '../components/Album';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    selectedAlbum: state.albums.selected
  };
};

export default connect(mapStateToProps)(Album);

