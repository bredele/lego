
/**
 * Dependencies
 */

var binding = require('./binding'),
    utils = require('./lib/utils');


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
  this.binding = binding();
}


/**
 * Set or render view's dom.
 * example:
 *
 *   view.html('#maple',data);
 *   view.html('<button>maple</button>',data);
 *   view.html(node,data); //with node HTMLElement
 *
 * @param {String|Element} tmpl
 * @param {Object} data 
 * @return {View}
 */

View.prototype.html = function(tmpl, data) {
	this.binding.data(data); //if data?
	if(typeof tmpl === 'string') {
		if(!~utils.indexOf(tmpl, '<')) {
			this.dom = document.querySelector(tmpl);
		} else {
			var frag = document.createElement('div');
			frag.insertAdjacentHTML('beforeend', tmpl);
			this.dom = frag.firstChild;
		}
		return this;
	}
	this.dom = tmpl;
	return this;
};


View.prototype.insert = function(el, bool) {
	this.binding.apply(this.dom, bool); //we should apply only once!
	if(typeof el === 'string') {
		el = document.querySelector(el);
	}
	el.appendChild(this.dom);
};
