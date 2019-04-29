//Module

var express = require('express');
var hash = require('pbkdf2-password')()
var path = require('path');
var session = require('express-session');
var User = require('./app/model/user');

var app = express();

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded({ extended: false }))
app.use(session({
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

// ログイン認証

function authenticate(email, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', email, pass);
  var user = User.findOne({ where:{email:email} }).then(user => {
      if (!user) return fn(new Error('cannot find user'));
      hash({ password: pass, salt: user.salt }, function(err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash === user.password) return fn(null, user)
        fn(new Error('invalid password'));
      });
  });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'アクセスできません！';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){
  res.send('アクセスできました！<a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  authenticate(req.body.email, req.body.password, function(err, user){
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user.id;
        req.session.success = 'ID:' + user.id
        res.redirect('success');
      });
    } else {
      req.session.error = 'メールアドレスまたはパスワードが間違っています。'
      res.redirect('/login');
    }
  });
});

app.get('/regist', function(req, res){
  res.render('regist');
});

app.post('/regist', function(req, res){
  var email = req.body.email
  hash({ password: req.body.password }, function (err, pass, salt, hash) {
      if (err) throw err;
      User.create({ email: email, password: hash, salt: salt }).then(mantaro => {
        console.log("ユーザーが作られました");
      });
  });
  res.redirect('login')
});

app.get('/success', function(req, res){
  res.render('success');
});


/* istanbul ignore next */
if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
}