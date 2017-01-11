import { RECEIVE_SONGS } from '../constants';

import axios from 'axios';

export const receiveAllSongs = songs => ({
  type: RECEIVE_SONGS,
  songs
});

export const loadAllSongs = () => {
  return dispatch => {
    axios.get('/api/songs')
      .then(response => {
        dispatch(receiveAllSongs(response.data));
      });
  };
};

