/* mongodb connection */

if(process.env.MONGOLAB_URI)
	var databaseURI = process.env.MONGOLAB_URI+'/webchat';
else
	var databaseURI = || "localhost:27017/webchat";
var collections = ['users','chats'];
var db = require("mongojs").connect(databaseURI,collections);

module.exports = db;