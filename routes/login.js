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
    req.session.error = 'ログインしてください';
    req.session.url = req.originalUrl;
    res.redirect('/login');
  }
}

function redirectLoggedIn(req, res, next) {
    if (req.session.user) {
        res.redirect('success')
    }else{
        next();
    }
}

router.get('/',redirectLoggedIn, function(req, res){
  res.redirect('/login');
});

router.get('/restricted', restrict, function(req, res){
  res.send('ログイン後に行けるページです<a href="/logout">logout</a>');
});

router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

router.get('/login', redirectLoggedIn, function(req, res){
  res.render('login');
});

router.post('/login', function(req, res){
  authenticate(req.body.email, req.body.password, function(err, user){
    if (user) {
      if (req.session.url) var url = req.session.url;
      req.session.regenerate(function(){
        req.session.user = user.id;
        req.session.success = 'ID:' + user.id;
        if (url){
          res.redirect(url)
        }else {
          res.redirect('success');
        }
      });
    } else {
      req.session.error = 'メールアドレスまたはパスワードが間違っています。'
      res.redirect('/login');
    }
  });
});

router.get('/success', restrict, function(req, res){
  res.render('success');
});

module.exports = router;

