var Promise = require('bluebird'),
    request = require('request'),
    pretty = require('prettysize'),
    fs = require('fs'),
    path = require('path'),
    config = require('../config');

var Spark = require('csco-spark');

module.exports = (function() {
  var cntrler = {};
  cntrler.getAuthorized = (req, res) => {
    var auth = {
      response_type: encodeURIComponent('code'),
      scope: encodeURIComponent('spark:messages_read spark:rooms_read'),
      state: encodeURIComponent('sparkadmin@wwt.com'),
      client_id: encodeURIComponent(config.id),
      redirect_uri: encodeURIComponent('http://45.55.244.195:8080/sparkaxxs')
    };
    res.json({uri:`https://api.ciscospark.com/v1/authorize?response_type`+
      `=${auth.response_type}&scope=${auth.scope}&state`+
      `=${auth.state}&client_id=${auth.client_id}`+
      `&redirect_uri=${auth.redirect_uri}`});
  };

  cntrler.getAccessToken = (req, res) => {
    var code = req.params.code;
    var spark = Spark({uri:'make optional', token:'make optional'});
    spark.getAccessToken({
      code: code,
      id: config.id,
      secret: config.secret,
      redirectUri: 'http://45.55.244.195:8080/sparkaxxs'
    }).then(function(resp) {
      res.json(JSON.parse(resp));
    });
  };

  cntrler.getSparkRooms = (req, res) => {
    var token = req.params.token;
    var spark = Spark({
      uri: 'https://api.ciscospark.com/v1',
      token: token
    });
    spark.getRooms().then(function(rooms) {
      res.status(200).send(rooms);
    })
  };

  cntrler.getFiles = (req, res) => {
    var roomId = req.params.roomId;
    var token = req.params.token;
    var spark = Spark({
      uri: 'https://api.ciscospark.com/v1',
      token: token
    });
    spark.getMessages({roomId: roomId}).then((msges) => {
      var fileUris = msges
        .filter((msg) => msg.files)
        .map((msg) => msg.files)
        .reduce((arr, files) => arr.concat(files), []);
      return Promise.map(fileUris, (fileUri) => {
        var uri = fileUri;
        return spark.dlFiles(uri).then((payload) => {
          // Add FileSize and FileUri to the Object
          if(payload.blob.data) {
            payload.fileSize = pretty(payload.blob.data.length);
          } else {
            payload.fileSize = pretty(payload.blob.length);
          }
          payload.fileUri = uri;
          return payload;
        });
      }).then((results) => res.status(200).send(results));
    });
  };

  cntrler.saveFile = (req, res) => {
    var fileName = req.body.fileName;
    var fileContents = req.body.fileContents;
    var fileExt = path.extname(fileName);
    var fd = fs.openSync(path.join(__dirname,`../files/${fileName}`), 'w+');
    if(fileExt==='.png' || fileExt==='.jpg') {
      fs.writeFileSync(fd, fileContents, 'base64');
    } else {
      fs.writeFileSync(fd, fileContents);
    }
    fs.closeSync(fd);
    res.send(`http://45.55.244.195:8080/dlfile/${fileName}`);
  };

  cntrler.dlFile = (req, res) => {
    setTimeout(() => {
      var fileName = req.params.filename;
      var filePath = path.join(__dirname, `../files/${fileName}`);
      res.sendFile(filePath);
      fs.unlinkSync(filePath);
    }, 5000);
  };

  return cntrler;
}());
