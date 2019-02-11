var app = require('./lib/Express');
var createError = require('http-errors');
var cors = require('cors');
var mongoose = require('mongoose');

require('dotenv').config({ path: './environment.env' });
var config = require('./config/index');
var indexRouter = require('./routes/index');

// Set up mongoose connection
var mongoDB = config.database;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'MongoDB connection error:'));

// Configuring CORS
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use('/api', cors(corsOptions), indexRouter);

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
