var moment = require('moment'),
    Promise = require('bluebird'),
    sparkFactory = require('csco-spark');

var spark = sparkFactory({
  uri: 'https://api.ciscospark.com/v1',
  token: 'YzVkY2JmMTQtMjhlZC00NWQyLWE2NDgtNjk4NDU4Zjc1M2E2NDllNjQzNjctZDhk'
});
var roomId =
  'Y2lzY29zcGFyazovL3VzL1JPT00vZWRiMTAxNjAtZWViMS0xMWU0LWJlNmQtZmY4ZTgwOTRiOGZj';
spark.getMessages({
  roomId: roomId
}).then(function(data) {
  var msges;
  //* 5/1/2015 8:30 PM
  var dateFormat = 'l LT';
  var messages = JSON.parse(data).items;
  msges = messages.reduce(function(str, message) {
    str += message.personEmail + ' ' +
      moment(new Date(message.created)).format(dateFormat)+'\n' +
      message.text+'\n\n';
    return str;
  }, '');


  console.log(msges);
})
