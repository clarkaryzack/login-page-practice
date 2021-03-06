const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const data = require('./data.js');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

function authenticate(req, username, password){
  var authenticatedUser = data.users.find(function (user) {
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;
      console.log('User & Password Authenticated');
    } else {
      return false;
    }
  });
  console.log(req.session);
  return req.session;
};

app.get('/', function (req, res){
	if (req.session && req.session.authenticated){
    res.render('index');
  } else {
    res.redirect('/login');
  }
});

app.post('/', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  authenticate(req, username, password);
  if (req.session && req.session.authenticated){
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.post('/foo', function(req, res){
	res.redirect('/foo');
});

app.post('/bar', function(req, res){
	res.redirect('/bar');
});

app.get('/login', function (req, res) {
	res.render('login');
});

app.get('/foo', function (req, res) {
	if (req.session.foo === undefined){
		req.session.foo = 1} else {
			req.session.foo ++}
	res.render('foo', {foo: req.session.foo});
});

app.get('/bar', function (req, res) {
	if (req.session.bar === undefined){
		req.session.bar = 1} else {
			req.session.bar ++}
	res.render('bar', {bar: req.session.bar});
});

app.listen(3000, function(){
  console.log('Started express application!')
});
