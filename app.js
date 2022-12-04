const path = require('path');
const express = require('express');
const morgan = require('morgan');
const pug = require('pug');
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const viewRouter = require('./routes/viewRoutes');

const app = express();

app.use(cookieParser())

//Setting the view engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', viewRouter);

const userRouter = require('./routes/userRoutes');
app.use('/', userRouter);

const loanRouter = require('./routes/loanRoutes');
app.use('/loans', loanRouter);

module.exports = app;
