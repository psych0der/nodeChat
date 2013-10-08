var crypto = require('crypto');
var uuid = require('node-uuid');

var db = require('../lib/db.js');

//console.log(db.users);


/* home page */

exports.index = function(req, res){

	
	if(!req.session.loggedIn)
	{
		res.redirect('/login');
	}

else {

	res.render('index', 
		{

			'nick' : req.session.nick, 
  			partials : 
  			{
  				header : 'header',
  				footer : 'footer'
  			} 
		
		});
}

};

exports.registerForm = function(req,res) {

	
	res.render('register', 
		{
			partials : 
  			{
  				header : 'header',
  				footer : 'footer'
  			} 
		
		});
}

exports.logout = function(req,res) {

	
	
	req.session = null;
	//req.session.destroy(function() {});
	res.clearCookie('mycustomkey');
  	res.redirect('/');
}


exports.loginForm = function(req,res) {

	
	res.render('login', 
		{
			partials : 
  			{
  				header : 'header',
  				footer : 'footer'
  			} 
		
		});
}

exports.messages = function(req,res) {

var nick = req.session.nick;
var threads; 

db.chats.find({to : nick},{from:1},function(err,docs){

var names = {}
var threads = [];

docs.forEach(function(obj){

if(names[obj.from]== undefined)
{
	threads.push(obj);
	names[obj.from] = 1;
}

});

	res.render('messages', 
		{
			'threads' : threads,
			partials : 
  			{
  				header : 'header',
  				footer : 'footer'
  			} 
		
		});




});


}


exports.threads = function(req,res) {

nick = req.session.nick;
from = req.params.from;

db.chats.find({$or :[{from : from , to : nick},{from: nick , to: from}]}).sort({time:-1},function(err,docs){

console.log(docs);



});



}


exports.register = function(req,res) {

	
	var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

		var nick = req.body.nick;
		var email = req.body.email;
		var password = crypto.createHash('md5').update(req.body.password).digest("hex");

		//Check whether all fields are posted
		if(nick && email && req.body.password){
			
			if(email.match(pattern)){
				//Check for email availability
				db.users.findOne({ email: email}, function (err, doc){
					if(!doc){
						var usernameRegex = /^[a-zA-Z0-9_]+$/;
						//Check whether valid username
						if(nick.match(usernameRegex)){
							//Check username for availability
							db.users.findOne({ nick: nick}, function (err, doc){
								if(!doc){
								
								//req.url = "/";	
								db.users.save({nick:nick,email : email, password:password});

								res.render('success', 
								{

								'nick' : nick, 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});


								}
								else{
								
								res.render('register', 
								{

								'error' : 'username aready taken', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});
								}
							
						});
					}
					else{
							
								res.render('register', 
								{

								'error' : 'Invalid username', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});



						}
					}else{
							res.render('register', 
								{

								'error' : 'email already exists', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});
					}
				});
			}else{
				
								res.render('register', 
								{

								'error' : 'invalid email id', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});
			}
		}else{
								res.render('register', 
								{

								'error' : 'all fields are mandatory', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});
		}



}


exports.login = function(req,res)
{

	
	if(!req.session.loggedIn)
	{

		var nick = req.body.nick;
		var password = crypto.createHash('md5').update(req.body.password).digest("hex");

		if(nick && req.body.password){
			var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
			db.users.findOne({ nick: nick, password: password}, function (err, doc){
					if(doc){
						var logincode = uuid.v4();
						req.session.logincode = logincode;
						req.session.loggedIn = true;
						req.session.nick = nick;

						res.redirect('/');

					}else{
						
						res.render('login', 
								{

								'error' : 'login failed', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});

					}
			
				});
			
		
	}
	else
	{
		res.render('login', 
								{

								'error' : 'details missing', 
  								partials : 
  								{
  									header : 'header',
  									footer : 'footer'
  								} 
		
								});

	}

}
	else{

		req.redirect('/');
	}


}
