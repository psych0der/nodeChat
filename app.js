
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


var db = require('./lib/db.js');


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
app.get('/logout',routes.logout);

app.post('/register',routes.register);
app.post('/login',routes.login);





/* Socket communiction handling */


io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        
         data.cookie = cookie.parse(data.headers.cookie,'');
        data.sessionID = data.cookie['mycustomkey'].split(':')[1].split('.')[0];//.split('.')[0];
        //console.log(data.sessionID);
        //console.log(store);
        store.get(data.sessionID, function (err, session) {
            if (err || !session) {
                // if we cannot grab a session, turn down the connection
                accept('Errorssss', false);
            } else {
               
                data.session = session;
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});



io.sockets.on('connection', function (socket) {

	//console.log(store);
	
		socket.on('addUser', function (name) {

			var users_copy = users;
			delete users_copy[socket.handshake.session.nick];
			socket.emit('other-users',users_copy);
			delete users_copy;

		if( typeof users[socket.handshake.session.nick] == 'undefined')
		{
			users[socket.handshake.session.nick]= socket.id;
			socket.broadcast.emit('new-user',socket.handshake.session.nick);
		}
		
	});


	socket.on('endSession', function(){
		console.log('here');
		socket.broadcast.emit('remove-user',socket.handshake.session.nick);
		delete users[socket.handshake.session.nick];


	});

	socket.on('send to all' , function(packet){

		console.log(packet.message);
		var from = socket.handshake.session.nick;
		for(to in packet.to)
		{
			db.chats.save({from:from, to :to, message: packet.message ,date: Date.now() , seen : false});

			if(users[to]!=undefined)
			{

				io.sockets.socket(users[to]).emit('message',{from : from , message : packet.message ,date: Date.now()})

			}
		}


	});
	socket.on('fetch history', function(){

		
		db.chats.find({to: socket.handshake.session.nick , seen : false},function(err,docs){


			socket.emit('history', docs);

			//console.log('results '+JSON.stringify(docs));

		});/*.forEach(function(err,doc){

			if(!doc)
			{
				return;
			}

			console.log(history.push(doc));
			//console.log(doc);
			return history;

		});
	*/
		//console.log('history : '+history);
		//console.log('results '+JSON.stringify(results));
		//socket.emit('history', {history:history});

	});

	socket.on('disconnect',function(){
		console.log('disconnected');
		socket.broadcast.emit('remove-user',socket.handshake.session.nick);
		delete users[socket.handshake.session.nick];

	});

	/*
	socket.on('message', function (message) {

		socket.get('username', function (error, name) {
			var data = { 'message' : message, 'user' :name};
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});

	socket.on('endSession1' , function(){
		
		socket.get('username',function(err,name){

			delete users[name];
			socket.broadcast.emit('updateUsers',users);
		});

	*/
		



});







server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
