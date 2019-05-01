var express = require('express');
var router = express.Router();
var User = require('../app/model/user');

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'ログインしてください';
    req.session.url = req.originalUrl;
    res.redirect('/login');
  }
}

router.post('/', restrict, function(req, res) {
   var user = User.findOne({ where:{id:req.session.user} }).then(user => {
     res.render('room', {roomId: req.body.roomId, userName: user.name });
   });
});

router.get('/', restrict, function(req, res){
  res.render('chat');
});


module.exports = router;