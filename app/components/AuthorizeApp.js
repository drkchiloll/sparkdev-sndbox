import React from 'react';

export default class AuthorizeApp extends React.Component {
  authenticate() {
    fetch('/authorized').then(function(resp) {
      return resp.json();
    }).then(function(authorizeUri) {
      window.location = authorizeUri.uri;
    })
  }
  render() {
    return (
      <div>
        <p>
          This application pulls the rooms you have memberships in and
          downloads the files that have been uploaded into those rooms on
          your behalf.
        </p>
        <p>
          If you would like this application to perform this task on your
          behalf please click the <strong>Authorize App</strong> button.
        </p>
        <button
          style={{
            width: '200px',
            length: '200px'
          }}
          className='btn btn-lg btn-success'
          onClick={this.authenticate}>
          Authorize App
        </button>
      </div>
    );
  }
}
