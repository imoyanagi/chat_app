var express = require('express');
var router = express.Router();
var models = require('../models');

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'ログインしてください';
    req.session.url = req.originalUrl;
    res.redirect('/login');
  }
}

router.get('/', restrict, function(req, res){
  var users = models.user.findAll().then(users => {
    models.roomUser.findAll({ where:{userId: req.session.user} }).then(rooms => {
      var getRooms = [];
      var promises = [];
      rooms.forEach(function(room){
        promises.push(room.getRoom().then(room => {
          getRooms.push(room.name);
        }));
      });
      Promise.all(promises).then(results => {
        console.log(getRooms);
        res.render('chat', {users: users, rooms: getRooms});
      });
    });
  });
});

module.exports = router;