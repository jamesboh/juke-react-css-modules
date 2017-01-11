import { RECEIVE_ALBUMS, RECEIVE_ALBUM } from '../constants';
import axios from 'axios';

export const receiveAlbums = albums => ({
    type: RECEIVE_ALBUMS,
    albums
});

export const receiveAlbum = album => ({
    type: RECEIVE_ALBUM,
    album
});

export const getAlbumById = albumId => {
  return dispatch => {
    axios.get(`/api/albums/${albumId}`)
      .then(response => {
        dispatch(receiveAlbum(response.data));
      });
  };
};
