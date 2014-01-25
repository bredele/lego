var Builder = require('component-builder'),
    rework = require('./rework'),
    utils = require('./utils'),
    mkdir = require('mkdirp'),
    fs = require('fs'),
    write = fs.writeFileSync;


/**
 * Component builder.
 */

module.exports = function(req, res, next) {
  mkdir.sync('public');
  var start = new Date;
  var builder = new Builder('.');
  builder.copyAssetsTo('public');
  builder.use(rework);
  builder.addSourceURLs(); //dev mode
  builder.build(function(err, res){
    if (err) return next(err);
    var js = res.require + res.js;
    write('assets/maple.js', js);
    write('assets/maple.css', res.css);
    utils.log('js', (js.length / 1024 | 0) + 'kb');
    utils.log('css', (res.css.length / 1024 | 0) + 'kb');
    utils.log('duration', (new Date - start) + 'ms');
  });
  if(next) next();
};