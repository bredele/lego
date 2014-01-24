
/**
 * Module dependencies.
 */

var express = require('express'),
    path = require('path'),
    build = require('boot');

var app = module.exports = express();


// middleware

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.static(path.resolve(__dirname, '..', '.')));
app.use(express.errorHandler());

// settings
app.engine('html', require('ejs').renderFile);
app.set('views',path.resolve(__dirname, '..'));


//mount

app.get('*', build, function(req, res){
	//index.html is served as static
  res.render('maple.html');
});