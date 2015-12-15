/**
 * Module dependencies.
 */

var Cement = require('cement');
var Store = require('datastore');
var mouth = require('mouth');
var dom = require('stomach');


/**
 * Expression cache.
 * @type {Object}
 */

var cache = {};



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
  this.state = 'created';
}


Brick.prototype = Store.prototype;
// @todo mixin refactor
for (var key in Cement.prototype) {
  Brick.prototype[key] = Cement.prototype[key];
}


/**
 * Add state machine transition
 * aka hook.
 *
 * Listen to a change of state or
 * define a state transition callback.
 *
 * Examples:
 *
 *   // transition on event lock
 *   lego.hook('created', 'lock', 'locked');
 *   lego.emit('lock');
 *   
 *   // with callback
 *   lego.hook('created', 'lock', function() {
 *     // do something
 *   }, 'locked');
 * 
 * @param  {String}   before
 * @param  {String}   ev
 * @param  {Function?} cb
 * @param  {String?}   after
 * @return {this}
 * @api public
 */

Brick.prototype.hook = function(before, ev, cb, after) {
  if(typeof cb === 'string') {
    after = cb;
    cb = null;
  }
  var that = this;
  this.on(ev, function() {
    if(that.state === before) {
      cb && cb.apply(that, arguments);
      if(after) that.state = after;
    }
  });
  return this;
};



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
 * Append brick to
 * dom element.
 *
 * Examples:
 *
 *   // dom element
 *   var foo = brick(tmpl);
 *   foo.to(document.body);
 *
 *   // query selector
 *   var bar = brick(tmpl);
 *   bar.to('.article');
 * 
 * @param  {Element | String} el
 * @return {this}
 * @api public
 */

Brick.prototype.to = function(el) {
  this.render();
  dom(el).appendChild(this.el);
};
