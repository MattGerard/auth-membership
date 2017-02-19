const express = require('express');
const path = require('path');
const dotenv = require('dotenv/config');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const user = require('./routes/user');
const todo = require('./routes/todo');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const hbs = require('hbs');
const methodOverride = require('method-override');
const app = express();
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());

//passport & sessions
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.use('/', index);
app.use('/user', user);
app.use('/todo', todo);
app.use('/auth', auth);
app.use('/admin', admin)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//HandleBars Helper
hbs.registerHelper('select', (selected, options) => {
  return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});


module.exports = app;
