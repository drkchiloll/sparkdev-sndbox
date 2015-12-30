import React from 'react';

export default class AuthAxxToken extends React.Component {
  getInitialState() {
    return {
      rooms: null
    };
  }
  componentWillMount() {
    var code = this.props.location.query.code;
    fetch(`/axxtoken/${code}`, {
      credentials: 'same-origin'
    }).then(function(resp) {
      return resp.json()
    }).then(function(data) {
      console.log(data);
      var token = data.access_token;
      fetch(`/sparkrooms/${token}`, {
        credentials: 'same-origin'
      }).then(function(res) {
        return res.json();
      }).then(function(rooms) {
        this.setState(rooms);
      }.bind(this))
    })
  }
  render() {
    var rooms = this.state.rooms;
    return (
      {rooms ? this._renderRooms(rooms) :
        <div> Waiting for Rooms To Load </div>
      }
    );
  }
  _renderRooms(rooms) {
    return (
      <div>
        <div> Select a Room </div>
        <select className='form-control'>
          {return rooms.map((room) => {
            return (
              <option key={room.id}>{room.title}</option>
            );
          })}
        </select>
    );
  }
}
