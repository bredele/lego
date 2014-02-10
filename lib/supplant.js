var utils = require('./utils'),
    re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;


var cache = {};


function props(str) {
	//benchmark with using match and uniq array
	var arr = [];
	str.replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
		.replace(/[a-zA-Z_]\w*/g, function(expr) {
			if(!~utils.indexOf(arr, expr)) arr.push(expr);
		})
	return arr;
}


function fn(_) {
	return 'model.' + _;
}


function map(str) {
	var arr = props(str);
	return str.replace(re, function(_){
		if ('(' == _[_.length - 1]) return fn(_);
		if (!~utils.indexOf(arr, _)) return _;
		return fn(_);
	});
}


function scope(str) {
  return new Function('model', 'return ' + map(str));
}

/**
 * Variable substitution on the string.
 *
 * @param {String} str
 * @param {Object} model
 * @return {String} interpolation's result
 */

module.exports = function(text, model){
	return text.replace(/\{\{([^}]+)\}\}/g, function(_, expr) {
		if(/[.'[+(]/.test(expr)) {
			var cb = cache[expr] = cache[expr] || scope(expr);
			return cb(model) || '';
		}
		return model[utils.trim(expr)] || '';
	});
};

/**
 * Substitutions attributes.
 * 
 * @param  {String} text 
 * @return {Array}
 */
module.exports.attrs = function(text) {
	var exprs = [];
	text.replace(/\{\{([^}]+)\}\}/g, function(_, expr){
		var val = utils.trim(expr);
		if(!~utils.indexOf(exprs, val)) exprs.push(val);
	});
	return exprs;
};