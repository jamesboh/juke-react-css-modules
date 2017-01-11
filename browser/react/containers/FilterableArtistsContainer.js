import React, { Component } from 'react';
import FilterInput from '../components/FilterInput';
import Artists from '../components/Artists';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const artists = state.artists;
  const playlists = state.playlists;

  return {
    artists: artists.list,
    list: playlists.list
  };
};

export default connect(mapStateToProps)
(class extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    const inputValue = evt.target.value;
    this.setState({ inputValue });
  }

  render() {

    const inputValue = this.state.inputValue;
    const filteredArtists = this.props.artists.filter(artist => artist.name.match(inputValue));

    return (
      <div>
        <FilterInput handleChange={this.handleChange} inputValue={inputValue} />
        <Artists artists={filteredArtists}/>
      </div>
    );
  }
});
