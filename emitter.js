
/**
 * Dependencies.
 */

var mixin = require('utils').mixin;


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
  if (obj) return mixin(obj);
}


/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

Emitter.prototype.on = function(event, fn){

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

};


