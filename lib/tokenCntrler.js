var Promise = require('bluebird'),
    request = require('request'),
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

  return cntrler;
}());
