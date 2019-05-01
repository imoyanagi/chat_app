//Module
var login = require('./routes/login')
var regist = require('./routes/regist')
var chat = require('./routes/chat')
var express = require('express');
var path = require('path');
var session = require('express-session');
var FileStore = require("session-file-store")(session);


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded({ extended: false }))
app.use(session({
  store: new FileStore({logFn: function(){}}),
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

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

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'ログインしてください';
    req.session.url = req.originalUrl;
    res.redirect('/login');
  }
}

// chat



// make a chat room

app.post('/chat', restrict, function(req, res){
  var roomId = req.body.roomId
  const nsp = io.of(`/${roomId}`);
  nsp.on('connection', function(socket){
    console.log('someone connected');
    socket.on('chat message', (msg) => {
      console.log(msg)
      nsp.emit('chat message', msg);
    });
  });
  // io.on('connection', function(socket){
  //   socket.join(roomId, () => {
  //     let rooms = Object.keys(socket.rooms);
  //     console.log(rooms); // [ <socket.id>, 'room 237' ]
  //     io.to(roomId).emit('a new user has joined the room'); // broadcast to everyone in the room
  //   });
  //   socket.on('chat message', (msg) => {
  //     io.to(roomId).emit('chat message', msg);
  //   });
  // });
  res.render('chat', {roomId: roomId})
});

// io.on('connection', function(socket){
//   socket.join('room 237', () => {
//     let rooms = Object.keys(socket.rooms);
//     console.log(rooms); // [ <socket.id>, 'room 237' ]
//     io.to('room 237').emit('a new user has joined the room'); // broadcast to everyone in the room
//   });
//   socket.on('chat message', (roomId, msg) => {
//     io.emit('chat message', msg);
//   });
// });


app.get('/chat', restrict, function(req, res){
  res.render('home');
});


app.use('/', login)
app.use('/regist', regist)

/* istanbul ignore next */
http.listen(8000, function(){
  console.log('listening on *:3000');
});