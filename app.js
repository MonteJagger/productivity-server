require('dotenv').config(); // environment path configured in .env file
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const itemsService = require('./routes/api/itemsService');
const session = require('express-session');

// initialize mongoose. name is 'todo'
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0-n2fzi.mongodb.net/todo1?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
      if (err) {
          console.error(`database connection error: ${err}`)
          process.exit;
      }else {
          console.log('mongoose connected successfully');
      }
  }
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('hius-secret'));
app.use(session({
  secret: "cscie31",
  resave: "true",
  saveUninitialized: "true"
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/items', itemsService);

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
