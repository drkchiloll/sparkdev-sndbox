var Promise = require('bluebird'),
    request = require('request'),
    config = require('../config');

module.exports = (function() {
  var cntrler = {};

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
  return cntrler;
}());
