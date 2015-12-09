/**
 * Brick dependencies.
 */ 

 var grout = require('grout');


/**
 * Expose 'brick'
 */

module.exports = function(cb) {
  return new Brick(cb);
};


function Brick(cb) {
  this.el = cb(grout)();
}
