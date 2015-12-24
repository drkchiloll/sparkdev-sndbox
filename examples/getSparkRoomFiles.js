var Promise = require('bluebird'),
    sparkFactory = require('csco-spark'),
    config = require('../config'),
    request = require('request'),
    fs = require('fs');

var spark = sparkFactory({
  uri: 'https://api.ciscospark.com/v1',
  token: config.token
});

var roomId = config.exRoom;
var fileUris = [];

spark.getMessages({
  roomId: roomId
}).then(function(data) {
  var messages = JSON.parse(data).items;
  var fileUris = messages
                  .filter((message) => message.files)
                  .map((message) => message.files)
                  .reduce((arr, files) => arr.concat(files), []);
  Promise.each(fileUris, function(uri) {
    return request.get({
      uri: uri,
      headers: {
        Authorization: `Bearer ${config.token}`
      },
      encoding: 'binary'
    }, function(err, resp, body) {
      var contents = resp.headers['content-disposition'];
      var fileName =
        contents
          .substring(contents.indexOf('"'))
          .replace(/"/gi, '');

      var file;
      if(resp.headers['content-type'].includes('image')) {
        file = new Buffer(body, 'binary').toString('base64');
        fs.writeFileSync(fileName, file, 'base64');
      } else {
        file = new Buffer(body, 'binary');
        fs.writeFileSync(fileName, file);
      }
    });
  }).then(function() {
    //Results have been settled
    console.log('files have been stored')
  })
})
