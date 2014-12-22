var express = require('express');
var app = express();
var session = require('express-session');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
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
	resave: false,
	saveUninitialized: true
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
	if(!sess.user)
		/* this is where we would login, lets set up as a gues */
		usercount ++;
		sess.user='Guest' + usercount;
		/* give a warm welcome */
		/*io.emit('chat message','New user '+sess.user + ' joined!');*/
		console.log('no user session');
	res.sendFile(__dirname + '/index.html');
});

/* web socket connection */
io.on('connection', function(socket){
	io.emit('nt_userlist',users);
	/*if(sess.user)
		io.emit('user join',sess.user);
		console.log('user ' + sess.user + ' connected');
		io.emit('chat message','New user '+sess.user + ' joined!');
	*/
    
	socket.on('disconnect',function(){
		io.emit('user leave',sess.user);
		console.log('user ' + sess.user + ' disconnected');
		io.emit('chat message','User '+sess.user + ' left!');
	});
	socket.on('chat message', function(msg){
	/*console.log(socket.request.connection);*/
	/*io.emit('chat message', socket.request.connection.remoteAddress + '> ' + msg);*/
	io.emit('chat message', sess.user + '# ' + msg);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
