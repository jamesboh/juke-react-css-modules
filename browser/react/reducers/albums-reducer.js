import {
  RECEIVE_ALBUMS,
  RECEIVE_ALBUM
} from '../constants';

import {convertAlbum, convertAlbums} from '../utils';

const initialAlbumsState = {
  selected: {},
  list: []
};

export default function (state = initialAlbumsState, action) {

  const newState = Object.assign({}, state);

  switch (action.type) {

    case RECEIVE_ALBUMS:
      newState.list = convertAlbums(action.albums);
      break;

    case RECEIVE_ALBUM:
      newState.selected = convertAlbum(action.album);
      break;

    default:
      return state;

  }

  return newState;

}
