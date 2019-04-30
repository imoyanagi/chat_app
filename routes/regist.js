var express = require('express');
var router = express.Router();
var hash = require('pbkdf2-password')()
var User = require('../app/model/user');

var app = express();

//CSRFミドルウェアを生成する
var csrf = require('csrf');
var tokens = new csrf();


function redirectLoggedIn(req, res, next) {
    if (req.session.user) {
        res.redirect('success')
    }else{
        next();
    }
}

router.get('/', redirectLoggedIn, function(req, res){
  var secret = tokens.secretSync();
  var token = tokens.create(secret);
  req.session._csrf = secret;
  res.render('regist', {token: token});
});

router.post('/', redirectLoggedIn, function(req, res){
  var secret = req.session._csrf;
  var token = req.body._csrf

   //秘密文字とトークンの組み合わせが正しいかチェックする
  if(tokens.verify(secret, token) === false)
  {
    throw new Error('Invalid Token');
  }

   //使用済みの秘密文字を削除する
  delete req.session._csrf;

  var email = req.body.email
  hash({ password: req.body.password }, function (err, pass, salt, hash) {
      if (err) throw err;
      User.create({ email: email, password: hash, salt: salt }).then(user => {
        console.log("ユーザーが作られました");
      });
  });
  res.redirect('login')
});

module.exports = router;