
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
 * 
 * @param {Object} mixin
 * @api public
 */

function View(mixin) {
  if(mixin) return utils.mixin(View.prototype, mixin);
  if(!(this instanceof View)) return new View(mixin);
}


/**
 * [html description]
 * @return {[type]} [description]
 */

View.prototype.html = function(tmpl) {
	if(typeof tmpl === 'string') {
		if(!~utils.indexOf(tmpl, '<')) {
			this.dom = document.querySelector(tmpl);
		} else {
			var frag = document.createElement('div');
			frag.insertAdjacentHTML('beforeend', tmpl);
			this.dom = frag.firstChild;
		}
		return;
	}
	this.dom = tmpl;
};

View.prototype.alive = function() {
	
};
