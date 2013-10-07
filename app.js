
/*  Module dependencies. */

var express = require('express');
var hoganex = require('hogan-express');


var routes = require('./routes');

var path = require('path');

var app = express()
 ,server = require('http').createServer(app)
 ,io = require('socket.io').listen(server)
 ,connect = require('connect')
 ,cookie = require('cookie') ;


//var uuid = require('node-uuid');


var store  = new express.session.MemoryStore();


/*  local Variables  */

var users = {};  // list of online





/* app config */

// all environments
app.set('port',process.env.PORT || 3000);
app.set('views', __dirname + '/views');


// set .html as the default extension 
app.set('view engine', 'html');
app.engine('html', hoganex);

app.use(express.cookieParser());
app.use(express.session({secret: 'Th1s1srand0mk3y$0rS3ss310n' , key: 'mycustomkey', store : store}));

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/register',routes.registerForm);
app.get('/login',routes.loginForm);

app.post('/register',routes.register);
app.post('/login',routes.login);





/* Socket communiction handling */


io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        
         data.cookie = cookie.parse(data.headers.cookie,'');
        data.sessionID = data.cookie['mycustomkey'].split(':')[1].split('.')[0];//.split('.')[0];
        console.log(data.sessionID);
        //console.log(store);
        store.get(data.sessionID, function (err, session) {
            if (err || !session) {
                // if we cannot grab a session, turn down the connection
                accept('Errorssss', false);
            } else {
                // save the session data and accept the connection
                console.log('success');
                data.session = session;
               // console.log(data.session);
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});



io.sockets.on('connection', function (socket) {
/*
	var cookie_string = socket.headers.cookie;
 	var parsed_cookies = express.cookieParser(cookie_string);
 	var connect_sid = parsed_cookies['connect.sid'];
  	if (connect_sid) {
    	session_store.get(connect_sid, function (error, session) {
      	console.log(session.nick);
    	});
  	}
*/
	console.log(socket.handshake.session.nick);
	
	socket.on('addUser', function (name) {
		socket.set('username', name);
		users[name]= name;
		socket.broadcast.emit('updateUsers',users);
		socket.emit('updateUsers',users);
	});
	
	socket.on('message', function (message) {
		socket.get('username', function (error, name) {
			var data = { 'message' : message, 'user' :name};
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});

	socket.on('endSession' , function(){
		
		socket.get('username',function(err,name){

			delete users[name];
			socket.broadcast.emit('updateUsers',users);
		});
		

	});


});







server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
