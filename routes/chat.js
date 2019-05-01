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
    var getUsers = [];
    for(var i=0; i < users.length; i++) {
      getUsers.push(users[i].dataValues.name);
    }
    var rooms = models.room.findAll().then(rooms => {
      var getRooms = [];
      for(var i=0; i < rooms.length; i++) {
        getRooms.push(rooms[i].dataValues.name);
      }
      res.render('chat', { users: getUsers, rooms: getRooms });
    });
  });
});


module.exports = router;