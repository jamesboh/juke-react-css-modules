import { RECEIVE_SONGS } from '../constants';

const initialSongsState = [];

export default function (state = initialSongsState, action) {

  switch (action.type) {

    case RECEIVE_SONGS:
      return action.songs;

    default:
      return state;
  }
}
