var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    socket = require('socket.io');

// Controller
var cntrler = require('./lib/tokenCntrler');

var app = express();

app
  .use(bodyParser.json({limit: '50mb'}))
  .use(bodyParser.urlencoded({extended: true}))
  .use(express.static('./build'))
  .use(express.static('./files'))

app.get('/authorized', cntrler.getAuthorized)
app.get('/axxtoken/:code', cntrler.getAccessToken);
app.get('/sparkrooms/:token', cntrler.getSparkRooms);
app.get('/dlfiles/:roomId/:token', cntrler.getFiles);

app.post('/savefile', cntrler.saveFile);
app.get('/dlfile/:filename', cntrler.dlFile);

var code;
app.get('*', function(req, res) {
  if(req.query.code) {
    code = req.query.code;
    return res.redirect(require('url').parse(req.url).pathname);
  }
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

var server = app.listen(8080);

var io = socket.listen(server);
io.sockets.on('connection', function(socket) {
  socket.emit('code', code);
});
