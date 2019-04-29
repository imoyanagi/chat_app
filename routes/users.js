var express = require('express');
var router = express.Router();
var hash = require('pbkdf2-password')()
var User = require('../app/model/user');

var app = express();


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

router.get('/', function(req, res){
  res.redirect('/login');
});

router.get('/restricted', restrict, function(req, res){
  res.send('アクセスできました！<a href="/logout">logout</a>');
});

router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function(req, res){
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

router.get('/regist', function(req, res){
  res.render('regist');
});

router.post('/regist', function(req, res){
  var email = req.body.email
  hash({ password: req.body.password }, function (err, pass, salt, hash) {
      if (err) throw err;
      User.create({ email: email, password: hash, salt: salt }).then(user => {
        console.log("ユーザーが作られました");
      });
  });
  res.redirect('login')
});

router.get('/success', function(req, res){
  res.render('success');
});

module.exports = router;

