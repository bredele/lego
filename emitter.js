
/**
 * Dependencies.
 */

var utils = require('./lib/utils');
//NOTES: should we move utils to the root?

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;


/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return utils.mixin(Emitter.prototype, obj);
  this.listeners = {};
}


/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

Emitter.prototype.on = function(event, fn){
	(this.listeners[event] = this.listeners[event] || []).push(fn);
	return this;
};


/**
 * Listen an `event` listener that will be executed a single
 * time.
 *
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

Emitter.prototype.once = function(event, fn){
	
};


/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

Emitter.prototype.off = function(event, fn){

};


/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 */

Emitter.prototype.emit = function(event){
	if(!this.listeners[event]) return;
	for(var i = 0, l = this.listeners[event].length; i < l; i++) {
		this.listeners[event][i].apply(this, utils.toArray(arguments, 1));
	}
};
