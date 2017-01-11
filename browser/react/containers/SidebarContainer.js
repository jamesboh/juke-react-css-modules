import Sidebar from '../components/Sidebar';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    playlists: state.playlists.list
  };
};

export default connect(
  mapStateToProps
)(Sidebar);
