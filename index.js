
/**
 * Module dependencies.
 */

var Store = require('datastore');
var Cement = require('cement');


/**
 * Expose 'brick'
 */

module.exports = brick;


/**
 * brick constructor.
 * @api public
 */

function brick(tmpl, data) {
  return new Brick(tmpl, data);
}


/**
 * Brick constructor.
 *
 * Examples:
 *
 *   var address = brick('<address>');
 *   var address = brick('<address>', data);
 * 
 * @param {String | Element?} tmpl
 * @param {Object?} data
 * @api public
 */

function Brick(tmpl, data) {
  Store.call(this, data);
  this.dom(tmpl);
  this.cement = new Cement();
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


/**
 * Add attribute binding.
 *
 * @note using closure is more
 * efficient than using native bind.
 * 
 * @param  {String} name 
 * @param  {Function} binding
 * @return {this}
 * @api public
 */

Brick.prototype.attr = function(name, binding) {
  var that = this;
  this.cement.bind(name, function(node, content) {
    binding.call(that, node, content);
  });
  return this;
};


/**
 * Apply bindings on dom
 * element.
 * 
 * @return {this}
 * @api public
 */

Brick.prototype.build = function() {
  this.cement.render(this.el, function() {

  });
  return this;
};

Brick.prototype.freeze = function() {
  
};

Brick.prototype.register = function() {
  
};