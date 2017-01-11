import React from 'react';
import SongsContainer from '../containers/SongsContainer';
import styles from '../styles/Album.css';

export default function (props) {

  const album = props.selectedAlbum;

  return (
    <div className={ styles.album }>
      <div>
        <h3>{ album.name }</h3>
        <img src={ album.imageUrl } className="img-thumbnail"/>
      </div>
      <SongsContainer songs={album.songs} />
    </div>
  );
}
