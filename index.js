var app = require('express')();
var session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* session handling */
app.use(session({secret: 'ssshhhhh'}));

var sess;

var usercount = 0;



/* initial page request */
app.get('/', function(req, res){
  sess=req.session;
  if(sess.user){
    console.log(sess.user);
  }
  else{
    /* this is where we would login, lets set up as a gues */
   usercount ++;
   sess.user='Guest' + usercount;
   /* give a warm welcome */
   io.emit('chat message','New user '+sess.user + ' joined!');
   console.log('no user session');
  }
  res.sendFile(__dirname + '/index.html');

});

/* web socket connection */
io.on('connection', function(socket){
  console.log('user ' + sess.user + ' connected');
  socket.on('disconnect',function(){
    console.log('user ' + sess.user + ' disconnected');
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
