const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// db 연결
db.sequelize.sync({force:false})
  .then(()=>{
    console.log("db 연결 성공")
  })
  .catch(()=>{
    console.log("db 연결 실패")
  })

//redis 연결

const client = db.redis
client.connect()
client.on('error', (err) => console.log('레디스 레디 실패^^'));
client.on("ready", ()=> console.log('레디스 레디 완^^'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  res.status(err.status || 500).json({message: err.message})
  
});

module.exports = app;
