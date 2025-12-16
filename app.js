var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layouts = require('express-ejs-layouts');
const dotenv = require ('dotenv');
dotenv.config();
const session = require('express-session')

const mariadb = require('mariadb/callback');
const db = mariadb.createConnection({host: process.env.DB_HOST,
                                      user: process.env.DB_USER,
                                      password: process.env.DB_PASSWORD,
                                      database: process.env.DB_DATABASE,
                                      port: process.env.DB_PORT});
// connect to database
db.connect((err) => {
  if (err) {
    console.log("Unable to connect to database due to error: " + err);
    res.render('error');
  } else {
    console.log("Connected to DB");
  }
});
global.db = db;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var privacyRouter = require('./routes/privacy');
var helpRouter = require('./routes/help');
var listingsRouter = require('./routes/listings');                   //Table listings
var usersRouter = require('./routes/users');                        //Table users
var saleorderRouter = require('./routes/saleorder');               //Table saleorder
var orderdetailRouter = require('./routes/orderdetail');          //Table orderdetail
var feedbackRouter = require('./routes/feedback');               //Table feedback
var shipmentsRouter = require('./routes/shipments');            //Table shipments
var categoryRouter = require('./routes/category');             //Table category
var subscriptionRouter = require('./routes/subscription');    //Table subscription
var searchRouter = require('./routes/search');
var reportsRouter = require('./routes/report');
var catalogRouter = require('./routes/catalog');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(layouts);

app.use(session({secret: 'UniAppSecret'}));
app.use(function(req,res,next){
res.locals.session = req.session;
next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/privacy', privacyRouter);
app.use('/help', helpRouter);
app.use('/listings', listingsRouter);                   //Table listings
app.use('/users', usersRouter);                        //Table users
app.use('/saleorder', saleorderRouter);               //Table saleorder
app.use('/orderdetail', orderdetailRouter);          //Table orderdetail
app.use('/feedback', feedbackRouter);               //Table feedback
app.use('/shipments', shipmentsRouter);            //Table shipments
app.use('/category', categoryRouter);             //Table category
app.use('/subscription', subscriptionRouter);    //Table subscription
app.use('/search', searchRouter);
app.use('/report', reportsRouter);
app.use('/catalog', catalogRouter);

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
