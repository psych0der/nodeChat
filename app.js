
/**
 * Module dependencies.
 */

var express = require('express');
var hoganex = require('hogan-express');


var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express()
 , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);



// all environments
app.set('port',process.env.PORT || 3000);
app.set('views', __dirname + '/views');


// set .html as the default extension 
app.set('view engine', 'html');
app.engine('html', hoganex);

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/* socket.io */

io.sockets.on('connection', function (socket) {
	socket.on('setPseudo', function (data) {
		socket.set('pseudo', data);
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});
});

/* socket io end */



app.get('/', routes.index);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
