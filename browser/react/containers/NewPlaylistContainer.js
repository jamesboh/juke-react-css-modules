import React, { Component } from 'react';
import NewPlaylist from '../components/NewPlaylist';
import { addNewPlaylist } from '../action-creators/playlists';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => {
  return {
    addNewPlaylist (playlistName) {
      dispatch(addNewPlaylist(playlistName));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      dirty: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (evt) {
    const value = evt.target.value;
    this.setState({
      inputValue: value,
      dirty: true
    });
  }

  handleSubmit (evt) {
    evt.preventDefault();
    this.props.addNewPlaylist(this.state.inputValue);
    this.setState({
      inputValue: '',
      dirty: false
    });
  }

  render () {
    const dirty = this.state.dirty;
    const inputValue = this.state.inputValue;
    let warning = '';

    if (!inputValue && dirty) warning = 'You must enter a name';
    else if (inputValue.length > 16) warning = 'Name must be less than 16 characters';

    return (
      <NewPlaylist
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        inputValue={inputValue}
        warning={warning}
      />
    );
  }
});
