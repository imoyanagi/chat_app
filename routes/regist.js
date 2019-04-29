var express = require('express');
var router = express.Router();
var hash = require('pbkdf2-password')()
var User = require('../app/model/user');

var app = express();

function redirectLoggedIn(req, res, next) {
    if (req.session.user) {
        res.redirect('success')
    }else{
        next();
    }
}

router.get('/', redirectLoggedIn, function(req, res){
  res.render('regist');
});

router.post('/', redirectLoggedIn, function(req, res){
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