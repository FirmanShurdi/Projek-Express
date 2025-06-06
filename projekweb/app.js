var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')
var logresRouter = require('./routes/logres').router;
var masterRouter = require('./routes/master');
var objekRouter = require('./routes/objek');
var detailRouter = require('./routes/detail');
var kategoriRouter = require('./routes/kategori');
var profilRouter = require('./routes/profil');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(session({
  secret: 'shurdikelompok',       
  resave: false,
  saveUninitialized: false
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', logresRouter);
app.use('/master', masterRouter);
app.use('/objek', objekRouter);
app.use('/detail', detailRouter);
app.use('/kategori', kategoriRouter);
app.use('/profil', profilRouter);

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

module.exports = app;