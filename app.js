//Module
var login = require('./routes/login')
var regist = require('./routes/regist')
var chat = require('./routes/chat')
var express = require('express');
var path = require('path');
var session = require('express-session');
var FileStore = require("session-file-store")(session);
var models = require('./models');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded({ extended: false }))
var sessionMiddleware = session({
  store: new FileStore({logFn: function(){}}),
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
});

// httpリクエスト用セッション
app.use(sessionMiddleware);
// socket.io用セッション
io.use(function(socket, next){
  sessionMiddleware(socket.request, socket.request.res, next);
});


// フラッシュメッセージ

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// chat

io.on('connection', function(socket){
  // make a chat room
  socket.on('create a room', function(roomId) {
    models.room.create({ name: roomId }).then(room => {
        console.log("roomが作られました");
    });
    socket.join(roomId, () => {
      // let rooms = Object.keys(socket.rooms);
      // console.log(rooms);
    });
  });

  // join a chat room
  socket.on('join a room', function(roomId) {
    socket.join(roomId);
  });

  // create msg
  socket.on('chat message', (msg, roomId) => {
    models.chat.create({ userId: socket.session.user, msg: msg });
    io.to(roomId).emit('chat message', msg);
  });
  socket.on('show users', function(){
    User.findAll().then (users => {
    });
  });
});


app.use('/', login)
app.use('/regist', regist)
app.use('/chat', chat)

/* istanbul ignore next */
http.listen(8000, function(){
  console.log('listening on *:8000');
});