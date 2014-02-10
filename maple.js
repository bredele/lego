
/**
 * Modules dependencies. 
 */

var App = require('./lib/app'),
		utils = require('./lib/utils');


var cache = [];


/**
 * Expose maple()
 */

module.exports = maple;


/**
 * Create a maple application.
 *
 * @return {Object}
 * @api public
 */

function maple() {
	var app = new App();
	for(var i = 0, l = cache.length; i < l; i++) {
		utils.mixin(app, cache[i]);
	}
	return app;
}


/**
 * Merge every application with passed object.
 * It can be really useful to extend the api (ex:superagent)
 * 
 * @param  {Object} obj 
 * @api public
 */

maple.merge = function() {
	cache = utils.array(arguments);
	return this;
};