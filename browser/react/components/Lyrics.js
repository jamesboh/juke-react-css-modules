import React from 'react';

export default function (props) {

  const text = props.text;
  const artistQuery = props.artistQuery;
  const songQuery = props.songQuery;
  const handleSubmit = props.handleSubmit;
  const handleChange = props.handleChange;

  const artistChange = e => handleChange('artist', e.target.value);
  const songChange = e => handleChange('song', e.target.value);

  return (
    <div style={{marginTop: '20px'}}>
      <form onSubmit={handleSubmit}>
        <div className="form-group row">
          <div className="col-md-6 col-xs-12">
            <label className="col-xs-2 control-label">Artist</label>
            <input
              className="form-control"
              type="text"
              value={artistQuery}
              placeholder="Enter an artist name"
              onChange={artistChange}
            />
          </div>
          <div className="col-md-6 col-xs-12">
            <label className="col-xs-2 control-label">Song</label>
            <input
              className="form-control"
              type="text"
              value={songQuery}
              placeholder="Enter a song name"
              onChange={songChange}
            />
          </div>
        </div>
        <pre>{text || 'Search above!'}</pre>
        <button type="submit" className="btn btn-success">
          Search for Lyrics
        </button>
      </form>
    </div>
  );
}
