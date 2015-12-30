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
    var options = {};
    options = {
      uri: 'https://api.ciscospark.com/v1/access_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      form : {
        grant_type: 'authorization_code',
        client_id: config.id,
        client_secret: config.secret,
        code: code,
        redirect_uri: 'http://45.55.244.195:8080/sparkaxxs'
      }
    };
    request.post(options, function(err, resp, body) {
      if(resp.statusCode === 200) {
        var payload = JSON.parse(body);
        res.json(payload);
      }
    })
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
