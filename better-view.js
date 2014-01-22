
/**
 * Dependencies
 */

var utils = require('./lib/utils');


/**
 * Expose 'View'
 */

module.exports = View;


/**
 * View constructor.
 * @api public
 */

function View(mixin) {
  if(mixin) return utils.mixin(View.prototype, mixin);
  if(!(this instanceof View)) return new View(mixin);
}

View.prototype.html = function() {
	
};

View.prototype.alive = function() {
	
};
