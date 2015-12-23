var moment = require('moment'),
    Promise = require('bluebird'),
    sparkFactory = require('csco-spark'),
    config = require('./config') || 'token';

var spark = sparkFactory({
  uri: 'https://api.ciscospark.com/v1',
  token: config.token || 'token'
});
var roomId =
  'Y2lzY29zcGFyazovL3VzL1JPT00vZWRiMTAxNjAtZWViMS0xMWU0LWJlNmQtZmY4ZTgwOTRiOGZj';
spark.getMessages({
  roomId: roomId
}).then(function(data) {
  var msges = '';
  //* 5/1/2015 8:30 PM
  var dateFormat = 'l LT';
  var messages = JSON.parse(data).items;
  return Promise.reduce(messages, function(str, message) {
    var msgCreated = new Date(message.created);
    if(!message.personEmail) {
      var personId = message.personId;
      return spark.getPerson({personId: personId}).then(function(res) {
        var person = JSON.parse(res);
        str += person.emails[0] + ' ' +
          moment(msgCreated).format(dateFormat) + '\n' + message.text + '\n\n';
        return str;
      });
    } else {
      str += message.personEmail + ' ' +
        moment(msgCreated).format(dateFormat) + '\n' + message.text + '\n\n';
      return str;
    }
  }, msges).then(function(res) {
    console.log(res);
  })
})
