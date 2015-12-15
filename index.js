/**
 * Module dependencies.
 */

var Cement = require('cement');
var Store = require('datastore');
var mouth = require('mouth');
var dom = require('stomach');
var many = require('many');
var fragment = require('fragment');



/**
 * Expose 'brick'
 */

module.exports = function(tmpl, data) {
  return new Brick(tmpl, data);
};


/**
 * Brick constructor.
 *
 * Examples:
 *
 *   var lego = brick('<button>');
 *   var lego = brick('<button>', data);
 * 
 * @param {String | Element?} tmpl
 * @param {Object?} data
 * @api public
 */

function Brick(tmpl, data) {
  Store.call(this, data);
  this.from(tmpl);
}


Brick.prototype = Store.prototype;
// @todo mixin refactor
for (var key in Cement.prototype) {
  Brick.prototype[key] = Cement.prototype[key];
}


/**
 * Create brick dom element from
 * string or existing dom element.
 * 
 * @param  {String | Element}  tmpl
 * @param {Boolean?} bool clone node
 * @return {this}
 * @api public
 */

Brick.prototype.from = function(tmpl, bool) {
  this.el = (typeof tmpl === 'function')
    ? tmpl(this)
    : dom(tmpl, bool);
  return this;
};


/**
 * Apply bindings on dom
 * element.
 *
 * @todo  benchmark if indexOf('$' ) - it
 * seems it doesn't change anything
 *
 * @note should render only once
 * 
 * @return {this}
 * @api public
 */

Brick.prototype.bind = function() {
	var store = this;
	//@ todo don't forget to cache and reuse with grout
	this.node(function(node) {
		var tmpl = mouth(node.nodeValue, store.data);
		var cb = tmpl[0];
		var keys = tmpl[1];
		var fn = function() {
		  node.nodeValue = cb(store.data);
		};
		fn();
		for(var l = keys.length; l--;) {
		  store.on('change ' + keys[l], fn);
		}
	});
};


/**
 * Add custom element.
 *
 * Brick allows you to create your
 * own tags (with the web component
 * standard) or to override existing
 * one.
 *
 * Examples:
 *
 *   var list = brick('<div><user /></div>');
 *   var user = brick('<button></button>');
 *
 *   list.tag('user', user);
 *
 * @todo  custom element from freezed brick
 * @todo  custom element attribute binding 
 * (using compiler and cache)
 * 
 * @param  {String} name
 * @param  {Brick} brick
 * @return {this}
 */

Brick.prototype.tag = many(function(name, brick) {
  brick.bind();
  this.query(name, function(node) {
  	replace(node, brick.el);
  	brick.query('content', function(content) {
  	  var select = content.getAttribute('select');
  	  if(select) {
  	    replace(content, node.querySelector(select));
  	  } else {
  	    replace(content, fragment([].slice.call(node.childNodes)));
  	  }
  	});
  });
});


/**
 * Replace one node with another.
 *
 * @note benchmark vs remove/insertBefore
 * 
 * @param {Element} old
 * @param {Element} el
 * @api private
 */

function replace(old, el) {
  old.parentNode.replaceChild(el, old);
}
