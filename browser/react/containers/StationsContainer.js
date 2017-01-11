import { connect } from 'react-redux';
import Stations from '../components/Stations';

const convertSongsToStations = function (songs) {
  return songs.reduce((stations, song) => {
    const genre = song.genre;
    stations[genre] = stations[genre] || [];
    stations[genre] = [...stations[genre], song];
    return stations;
  }, {});
};

const mapStateToProps = function (state) {
  return {
    stations: convertSongsToStations(state.songs)
  };
}

export default connect(mapStateToProps)(Stations);
