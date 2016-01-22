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
    request.post({
      uri: 'https://45.55.244.195/access',
      headers: {'Content-Type': 'application/json'},
      json: {
        id: config.id,
        secret: config.secret,
        redirectUri: 'http://45.55.244.195:8080/sparkaxxs',
        code: code
      },
      strictSSL: false,
    }, (err, resp, body) => {
      res.status(200).send(body);
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
      spark.getFileUris(msges).then((fileUris) => {
        return Promise.map(fileUris, (fileUri) => {
          var uri = fileUri;
          return spark.dlFiles(uri).then((payload) => {
            // Add FileSize and FileUri to the Object
            if(payload.blob.data) {
              payload.fileSize = pretty(payload.blob.data.length);
            } else {
              payload.fileSize = pretty(payload.blob.length);
            }
            // Temporarily Save the Files
            return cntrler.saveFile(payload).then((localUri) => {
              payload.fileUri = localUri;
              delete payload.blob;
              return payload;
            })
          });
        }).then((results) => res.status(200).send(results));
      });
    });
  };

  var closeFile = (fd) => {
    return new Promise((resolve, reject) => {
      fs.close(fd, (err) => { resolve(true) });
    });
  };

  cntrler.saveFile = (file) => {
    var fileName = file.fileName;
    var localFileUri = `http://45.55.244.195:8080/dlfile/${fileName}`;
    var fileContents = file.blob;
    var fileExt = path.extname(fileName);
    return new Promise((resolve, reject) => {
      fs.open(path.join(__dirname,`../files/${fileName}`), 'w+', (err, fd) => {
        if(fileExt==='.png' || fileExt==='.jpg' ||
           fileExt==='.zip' || fileExt==='.pdf' ||
           fileExt==='.docx' || fileExt==='.xlsx' ||
           fileExt==='.pptx') {
          fs.writeFile(fd, fileContents, 'base64', (err) => {
            if(err) return reject(err);
            closeFile(fd).then((boo) => resolve(localFileUri));
          });
        } else {
          fs.writeFile(fd, fileContents, (err) => {
            if(err) return reject(err);
            closeFile(fd).then((boo) => resolve(localFileUri));
          });
        }
      });
    });
  };

  cntrler.dlFile = (req, res) => {
    setTimeout(() => {
      var fileName = req.params.filename;
      var filePath = path.join(__dirname, `../files/${fileName}`);
      res.sendFile(filePath, (err) => {
        if(!err) fs.unlinkSync(filePath);
      });
    }, 5000);
  };

  return cntrler;
}());
