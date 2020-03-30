var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectLivereload;
var livereload;
const nunjucks = require('nunjucks');
const redis = require('redis');
const env = (process.env.NODE_ENV || 'development').toLowerCase();
const utils = require('./lib/utils.js')

console.log('NODE_ENV', process.env.NODE_ENV);
console.log('env', env);

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// only load refresh libs in devt
if (process.env.NODE_ENV === 'development') {
  connectLivereload = require("connect-livereload");
  livereload = require('livereload');
  app.use(connectLivereload());
}

var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();
// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(session({
  secret: 'keyboard cat',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
  saveUninitialized: true,
  resave: false
}));
app.use(utils.autoStoreData);

// view engine setup
let appViews = [
  path.join(__dirname, 'node_modules/govuk-frontend/'),
  path.join(__dirname, 'views')
]
let nunjucksConfig = {
  autoescape: true,
  noCache: true,
  express: app
}
// set up nunjucjs
var nunjucksAppEnv = nunjucks.configure(appViews, nunjucksConfig)
utils.addCheckedFunction(nunjucksAppEnv)

app.set('view engine', 'html')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (process.env.NODE_ENV === 'development') {
  // live reload of browser, listening high up in the ports
  var liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, 'public'));

  // wait for high port to re-establish...
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

module.exports = app;
