import Albums from '../components/Albums';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    albums: state.albums.list
  };
};

export default connect(
  mapStateToProps
)(Albums);
