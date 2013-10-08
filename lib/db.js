/* mongodb connection */

if(MONGOHQ_URL)
	var databaseURI = process.env.MONGOHQ_URL;
else
	var databaseURI = "localhost:27017/webchat";
var collections = ['users','chats'];
var db = require("mongojs").connect(databaseURI,collections);

module.exports = db;