var express = require('express');
var app = express();
var session = require('express-session');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var RedisStore = require('connect-redis')(session);
var session_store = new RedisStore;

/* database 
var mongoose = require('mongoose');
var dbhost = 'db1-prod.kulo.us';
var dbport = '27017';



mongoose.connect('mongodb://' + dbhost + ':' + dbport + '/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error: '));

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	name: String,
	email: String,
	createdDate: { 
		type: Date ,
		default: Date.now 
	}
})

var channelSchema = new Schema({
	name: String,
	createdDate: { 
		type: Date ,
		default: Date.now 
	}
})
var messageSchema = new  Schema({
	user: {
		type: ObjectId,
		ref: 'userSchema',
	},
	content: String,
	channel: {
		type: ObjectId,
		ref: 'channelSchema'
	}
})
		
*/

/* in memory storage 
var redis = require('redis'),
	memstore = redis.createClient();
memstore.on('error', function (err) {
	console.log(' Redis error: ' + err);
});
memstore.set('userlist',[]);
*/



/* session handling */
app.use(session({
	secret: 's883ndkhg1713bdub',
	resave: true,
	saveUninitialized: true,
	cookie:{
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null
	},
	store: new RedisStore()
}));

/* oAuth 
var passport = require('passport')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy;
*/


var sess;
var users = [];
var usercount = 0;

/* initial page request */
app.get('/style', function(req, res){
	res.sendFile(__dirname + '/assets/css/rkch.css');
});
app.get('/', function(req, res){
	sess=req.session;
	if(!sess){
		/* this is where we would login, lets set up as a guest 
		usercount ++;
		sess.user='Guest' + usercount;
		/* give a warm welcome */
		/*io.emit('chat message','New user '+sess.user + ' joined!');*/
	}
	else{
	}
	res.sendFile(__dirname + '/index.html');
});

/* web socket connection */
io.on('connection', function(socket){
	var data = socket.request;

	io.emit('log','connection from ' + data.connection.remoteAddress + ':' + data.connection.remotePort);
	
	/*
	if(sess){
		io.emit('user join',sess.user);
	}
	*/
	socket.on('disconnect',function(){
		io.emit('user leave','username');
		console.log('user ' + 'username' + ' disconnected');
		io.emit('chat message','User '+ 'username' + ' left!');
	});
	socket.on('chat message', function(msg){
	/*console.log(socket.request.connection);*/
	/*io.emit('chat message', socket.request.connection.remoteAddress + '> ' + msg);*/
	io.emit('chat message', 'username' + '#<br/>' + msg);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
