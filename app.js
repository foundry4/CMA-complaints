var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectLivereload;
var livereload;
const nunjucks = require('nunjucks');

const env = (process.env.NODE_ENV || 'development').toLowerCase();
var indexRouter = require('./routes/index');

var app = express();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var url = require('url');
const redis = require('redis');

var session = require('express-session');
var redisStore = require('connect-redis')(session);
let host = 'redis';
let port = 6379;
if(process.env.REDISTOGO_URL){
  var redisURL = url.parse(process.env.REDISTOGO_URL);
  console.log(redisURL)
  port = redisURL.port;
  host = redisURL.hostname;
}

var client = redis.createClient(port, host, {no_ready_check: true});
if (process.env.REDISTOGO_URL){
  client.auth(redisURL.auth.split(":")[1]);
}

const redis_config = { host, port, client: client,ttl :  86400000};
app.use(session({
  secret: 'keyboard cat',
  ttl :  86400000,
  cookie: {maxAge: 86400000 },
  // create new redis store.
  store: new redisStore(redis_config),
  saveUninitialized: true,
  resave: false
}));


// only load refresh libs in devt
if (process.env.NODE_ENV === 'development') {
  connectLivereload = require('connect-livereload');
  livereload = require('livereload');
  app.use(connectLivereload());
}

// view engine setup
let appViews = [
  path.join(__dirname, 'node_modules/govuk-frontend/'),
  path.join(__dirname, 'views')
]
let nunjucksConfig = {
  autoescape: true,
  express: app,
  web: {
    useCache:true
  }
}
// set up nunjucjs
nunjucks.configure(appViews, nunjucksConfig) 
app.set('view engine', 'html')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.cookieAccept = req.session["cookieAccept"];
  next();
});

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// Set Fathom id and use to include analytics script
//app.locals.FATHOM_ID = process.env.FATHOM_ID;


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
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
}

module.exports = app;
