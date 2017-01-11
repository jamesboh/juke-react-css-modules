import {
  SET_LYRICS
} from '../constants';

const initialLyricsState = {
  text: ''
};

export default function (state = initialLyricsState, action) {

  const newState = Object.assign({}, state);

  switch (action.type) {

    case SET_LYRICS:
      newState.text = action.text;
      break;

    default:
      return state;

  }

  return newState;

}
