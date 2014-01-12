

/**
 * Mixin to objects.
 * 
 * @param {Object} from
 * @param {Object} to 
 * @return {Object} to
 */

module.exports.mixin = function(from, to) {
	for (var key in from) {
		if (from.hasOwnProperty(key)) {
			to[key] = from[key];
		}
	}
	return to;
};


/**
 * toArray
 *
 * @param {Object}  obj Array-like or string
 * @param {Number}  index slice index
 * @return {Array} Empty Array if argument other than string or Object
 * @api public
 */

module.exports.toArray = function(arg, idx) {
	return [].slice.call(arg, idx);
};


/**
 * [indexOf description]
 * @return {[type]} [description]
 */

module.exports.indexOf = function() {

};


/**
 * [trim description]
 * @return {[type]} [description]
 */

module.exports.trim = function() {

};


/**
 * Object iteration.
 * @param  {Object}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 */

module.exports.each = function(obj, fn, scope) {
	if( obj instanceof Array) {
		for(var i = 0, l = obj.length; i < l; i++){
			fn.call(scope, i, obj[i]);
		}
	} else if(typeof obj === 'object') {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				fn.call(scope, i, obj[i]);
			}
		}
	}
};


/**
 * Clone object.
 * 
 * @param  {Object} obj 
 * @api private
 */

module.exports.clone = function clone(obj) {
	if(obj instanceof Array) {
		return obj.slice(0);
	}
	if(typeof obj === 'object') {
		var copy = {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				copy[key] = clone(obj[key]);
			}
		}
		return copy;
	}
	return obj;
};
