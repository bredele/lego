
/**
 * Module dependencies.
 */

var Store = require('datastore');


/**
 * Expose 'brick'
 */

module.exports = brick;


/**
 * brick constructor.
 * @api public
 */

function brick() {
  return new Brick();
}


function Brick() {
  Store.call(this);
}


Brick.prototype = Store.prototype;