/**
 * Module dependencies.
 */

var express = require('express');
var hash = require('pbkdf2-password')()
var path = require('path');
var session = require('express-session');
var User = require('./app/model/user');

var app = module.exports = express();

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

// Session-persisted message middleware

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

// Authenticate using our plain-object database of doom!

function authenticate(email, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', email, pass);
  var user = User.findOne({ where:{email:email} }).then(user => {
      console.log(user);
      // query the db for the given username
      if (!user) return fn(new Error('cannot find user'));
      // apply the same algorithm to the POSTed password, applying
      // the hash against the pass / salt, if there is a match we
      // found the user
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
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
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
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.email
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('success');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
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
      // store the salt & hash in the "db"
      User.create({ email: email, password: hash, salt: salt }).then(mantaro => {
        console.log("mantaro's auto-generated ID:", mantaro.id);
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