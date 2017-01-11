import React from 'react';
import SongsContainer from '../containers/SongsContainer';
import styles from '../styles/Album.css';
import CSSModules from 'react-css-modules';

class Album extends React.Component {
  render () {
    const album = this.props.selectedAlbum;

    return (
      <div styleName="album">
        <div>
          <h3>{ album.name }</h3>
          <img src={ album.imageUrl } className="img-thumbnail"/>
        </div>
        <SongsContainer songs={album.songs} />
      </div>
    );
  }
}

export default CSSModules(Album, styles)