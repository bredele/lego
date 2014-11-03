
/**
 * Module dependencies.
 */

var Store = require('datastore');
var Cement = require('cement');
var many = require('many');


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
  this.tmpl = arg;
  this.el = Brick.dom(arg);
  return this;
};


/**
 * Add attribute binding.
 *
 * As seen below, a brick can bind
 * existing attributes, dataset or
 * custom attributes.
 *
 * Examples:
 *
 *   brick.attr('class', fn);
 *   brick.attr('awesome', fn);
 *   brick.attr('data-test', fn);
 *   brick.attr({
 *     class: fn,
 *     'data-test': cb
 *   })
 *
 * @note using closure is more
 * efficient than using native bind.
 * 
 * @param  {String} name 
 * @param  {Function} binding
 * @return {this}
 * @api public
 */

Brick.prototype.attr = many(function(name, binding) {
  var that = this;
  this.cement.bind(name, function(node, content) {
    binding.call(that, node, content);
  });
  return this;
});


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


/**
 * Return a new brick from
 * a brick current's state.
 *
 * Freeze is better than a simple extend.
 * You can freeze a living brick with
 * its data.
 *
 * Examples;
 *
 *   var vehicle = brick(tmpl, data)
 *     .attr('type', cb)
 *     .freeze();
 *
 *   var car = vehicle();
 *   car.build();
 *
 *
 * @note freeze is still experimental 
 * and will probably change a lot.
 *
 * @note should we return a factory
 * or the a new brick right away?
 * 
 * @return {Function} brick factory
 * @api public
 */

Brick.prototype.freeze = function() {
  var data = this.data;
  var bindings = this.cement.bindings;
  var dom = this.tmpl;
  if(this.tmpl.cloneNode) dom = this.tmpl.cloneNode(true);

  return function(tmpl, obj) {
    var brick = new Brick(tmpl || dom);
    // @note we should clone data and pass in constructor
    brick.set(data);
    brick.set(obj);
    brick.attr(bindings);
    return brick;
  };
};


Brick.prototype.register = function() {
  
};