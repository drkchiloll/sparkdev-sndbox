var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

var app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(express.static('./build'))

app.get('/auth/:code', function(req, res) {
  console.log(req.params.code);
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(8080);
