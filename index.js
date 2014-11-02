
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


/**
 * Transform amything into dom.
 *
 * Examples:
 *
 *   brick.dom('<span>content</span>');
 *   brick.dom(el);
 *   brick.dom('.myEl');
 * 
 * @param  {String|Element} tmpl
 * @return {Element}
 * @api public
 */

Brick.dom = require('stomach');


/**
 * Create brick dom element from
 * string or existing dom element.
 * 
 * @param  {String | Element}  arg 
 * @return {this}
 * @api public
 */

Brick.prototype.dom = function(arg) {
  this.el = Brick.dom(arg);
  return this;
};


Brick.prototype.attr = function() {
  
};


Brick.prototype.build = function() {
  
};

Brick.prototype.freeze = function() {
  
};

Brick.prototype.register = function() {
  
};