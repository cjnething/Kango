var express = require('express');
var path = require('path');
var logger = require('morgan');
var url = require('url');
var bodyParser = require('body-parser');
var compress = require('compression');
var favicon = require('static-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var config = require('./config');
var routes = require('./routes');
var bookshelf = require('./app/config');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var configDB = require('./keys/database.js');
var knex = require('knex');

var app = express();

app.set('bookshelf', bookshelf);
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'ejs'); // set up ejs for templating

//pass passport for configuration
require('./keys/passport')(passport);

// routes
require('./app/models/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//**we need to connect to our database i.e. mongoose.connect(configDB.url)**

app
  .use(compress())
  .use(favicon())
  .use(logger('dev'))
  .use(morgan('dev')) // log every request to the console
  .use(cookieParser()) // read cookies (needed for auth)
  .use(bodyParser()) //get information from html forms
  .use(function(req, res, next) {
    req.parsed = url.parse(req.url);
    next();
  })
  .use(methodOverride())
  .use(express.static(path.join(__dirname, 'public')))
  .use(routes.indexRouter)
  // required for passport
  .use(session({ secret: 'teamdubioustarantula' })) // session secret
  .use(passport.initialize())
  .use(passport.session()) // persistent login sessions
  .use(flash()); // use connect-flash for flash messages stored in session;

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
