import {
  RECEIVE_ARTISTS,
  RECEIVE_ARTIST
} from '../constants';

import {convertAlbums, convertSong} from '../utils';

const initialArtistState = {
  selected: {},
  list: []
};

export default function (state = initialArtistState, action) {

  const newState = Object.assign({}, state);

  switch (action.type) {

    case RECEIVE_ARTISTS:
      newState.list = action.artists;
      break;

    case RECEIVE_ARTIST:
      action.artist.albums = convertAlbums(action.albums);
      action.artist.songs = action.songs.map(convertSong);
      newState.selected = action.artist;
      break;

    default:
      return state;

  }

  return newState;

}