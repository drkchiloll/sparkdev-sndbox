import React from 'react';

export default class AuthAxxToken extends React.Component {
  componentWillMount() {
    var code = this.props.location.query.code;
    fetch('/axxtoken', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({code: code})
    }).then(function(resp) {
      return resp.json()
    }).then(function(data) {
      console.log(data);
    })
  }
  render() {
    return (
      <div>Grant Axxs</div>
    );
  }
}
