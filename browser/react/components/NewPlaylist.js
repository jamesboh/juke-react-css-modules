import React from 'react';

export default function (props) {

  const handleChange = props.handleChange;
  const handleSubmit = props.handleSubmit;
  const warning = props.warning;
  const inputValue = props.inputValue;

  return (
    <div className="well" style={{marginTop: '20px'}}>
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <fieldset>
          <legend>New Playlist</legend>
          { warning && <div className="alert alert-warning">{warning}</div> }
          <div className="form-group">
            <label className="col-xs-2 control-label">Name</label>
            <div className="col-xs-10">
              <input
                className="form-control"
                type="text"
                onChange={handleChange}
                value={inputValue}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-10 col-xs-offset-2">
              <button
                type="submit"
                className="btn btn-success"
                disabled={!!warning || !inputValue}>
                Create Playlist
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
