/* mongodb connection */

var databaseURI = "localhost:27017/webchat";
var collections = ['users'];
var db = require("mongojs").connect(databaseURI,collections);

module.exports = db;