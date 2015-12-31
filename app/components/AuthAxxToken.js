import React from 'react';

export default class AuthAxxToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rooms: null };
  }
  componentWillMount() {
    var code = this.props.location.query.code;
    fetch(`/axxtoken/${code}`, {
      credentials: 'same-origin'
    }).then((resp) => {
      return resp.json()
    }).then((data) => {
      var token = data.access_token;
      fetch(`/sparkrooms/${token}`, {
        credentials: 'same-origin'
      }).then((res) => {
        return res.json();
      }).then((rooms) => {
        this.setState({rooms:rooms});
      });
    })
  }
  render() {
    return (
      <div>
      {this.state.rooms ? this._renderRooms() :
        <div> Waiting for Rooms To Load </div>
      }
      </div>
    );
  }
  _renderRooms() {
    var rooms = this.state.rooms;
    return (
      <div>
	<div className='col-sm-6'>
        <h4> Select a Room </h4>
        <select className='form-control'>
          {rooms.map((room) => {
            return (
              <option key={room.id} value={room.title}>{room.title}</option>
            );
          })}
        </select>
	</div>
      </div>
    );
  }
}
