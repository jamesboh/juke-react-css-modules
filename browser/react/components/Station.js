import React from 'react';
import SongsContainer from '../containers/SongsContainer';

export default function (props) {

  const genreName = props.genreName;
  const songs = props.songs;

  return (
    <div>
      <h3>{ genreName } Station</h3>
      <SongsContainer songs={songs} />
    </div>
  );
}
