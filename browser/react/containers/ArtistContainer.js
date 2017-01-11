import Artist from '../components/Artist';
import { toggleSong } from '../action-creators/player';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    selectedArtist: state.artists.selected,
    children: ownProps.children.props.children
  };
};

export default connect(
  mapStateToProps
)(Artist);

