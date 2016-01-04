import React from 'react';

export default class AuthAxxToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: null,
      selectedRoom: null,
      files: null
    };
    // Needed because I'm using this.state in the FN
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.getFiles = this.getFiles.bind(this);
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
        {
          this.state.rooms ?
            this._renderRooms() :
            <div> Waiting for Rooms To Load </div>
        }
        {
          this.state.files ?
            this._renderFiles() :
            <div></div>
        }
      </div>
    );
  }
  _renderRooms() {
    var rooms = this.state.rooms;
    return (
      <div className='row'>
      	<div className='col-sm-6'>
          <h4> Select a Room </h4>
          <div className='form-inline'>
            <select className='form-control' onChange={this.handleRoomChange}>
              {rooms.map((room) => {
                return (
                  <option key={room.id} value={room.title}>{room.title}</option>
                );
              })}
            </select>
            <button
	           className='btn btn-md btn-primary'
	           onClick={this.getFiles}>
	           Get Files
	          </button>
          </div>
      	</div>
      </div>
    );
  }
  _renderFiles() {
    var files = this.state.files;
    return (
      <div className='row'>
        <table className='table table-hover'>
          <tr>
            <th>File Type</th>
            <th>File Name</th>
            <th>File Size</th>
          </tr>
          <tr>
            {files.map((file) => {
              return (
                <td>{file.fileName.split(.)[1].toUpperCase()}</td>
                <td>{file.fileName}</td>
                <td>{file.blob.length}</td>
              );
            })}
          </tr>
        </table>
      </div>
    );
  }
  handleRoomChange(e) {
    var room = e.target.value;
    var rooms = this.state.rooms;
    var selectedRoom = rooms.find((rm) => rm.title === room);
    // console.log(selectedRoom);
    this.setState({selectedRoom: selectedRoom});
  }
  getFiles() {
    var roomId;
    if(!this.state.selectedRoom) {
      roomId = this.state.rooms[0].id;
    } else {
      roomId = this.state.selectedRoom.id;
    }
    fetch(`/dlfiles/${roomId}`, {
      credentials: 'same-origin'
    }).then((res) => {
      return res.json();
    }).then((files) => {
      console.log(files);
      this.setState({files: files});
    });
  }
}
