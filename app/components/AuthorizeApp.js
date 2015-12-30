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
      <button
        className='btn btn-lg btn-success'
        onClick={this.authenticate}>
        Authorize App
      </button>
    );
  }
}
