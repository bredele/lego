

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
 * [clone description]
 * @return {[type]} [description]
 */

module.exports.clone = function() {

};
