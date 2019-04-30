//Module
var login = require('./routes/login')
var regist = require('./routes/regist')
var express = require('express');
var path = require('path');
var session = require('express-session');
var FileStore = require("session-file-store")(session);

var app = express();

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

app.use('/', login)
app.use('/regist', regist)

/* istanbul ignore next */
if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
}