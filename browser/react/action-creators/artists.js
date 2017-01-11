import {RECEIVE_ARTISTS, RECEIVE_ARTIST} from '../constants';
import axios from 'axios';

export const receiveArtists = artists => ({
  type: RECEIVE_ARTISTS,
  artists
});

export const receiveArtist = (artist, albums, songs) => ({
  type: RECEIVE_ARTIST,
  artist,
  songs,
  albums
});

export const getArtistById = artistId => {
  return dispatch => {
    Promise
      .all([
        axios.get(`/api/artists/${artistId}`),
        axios.get(`/api/artists/${artistId}/albums`),
        axios.get(`/api/artists/${artistId}/songs`)
      ])
      .then(results => results.map(r => r.data))
      .then(results => {
        dispatch(receiveArtist(...results));
      });
  };
};
