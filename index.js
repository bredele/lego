/**
 * Brick dependencies.
 */ 

var Store = require('datastore');
var Cement = require('cement');
var dom = require('stomach');


/**
 * Expose 'brick'
 */

module.exports = function() {
	return new Brick();
}


function Brick() {
  Store.call(this);
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
	// @todo use cement instead and don't forget tmpl as function
	this.el = (typeof tmpl === 'function')
	  ? tmpl(this)
	  : dom(tmpl, bool);
	return this;
};

Brick.prototype.to = function() {
	
};
