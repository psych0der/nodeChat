/* mongodb connection */
//var db_url = "mongodb://nobles0ul:psych0der@paulo.mongohq.com:10068/webchat";
var mongojs = require('mongojs');
var databaseURI = process.env.MONGOHQ_URL || "localhost:27017/webchat";
var collections = ['users','chats'];
//console.log(' -- '+databaseURI);
var db = mongojs(databaseURI,collections);



module.exports = db;