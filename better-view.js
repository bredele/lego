
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
 * @api public
 */

View.prototype.html = function(tmpl, data) {
	if(data) this.binding.data(data);
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


/**
 * Plug/bind logic to the dom.
 * example:
 *
 *   view.plug('data-event', function(){});
 *   view.plug({
 *     'data-event' : function(){},
 *     'required' : function(){}
 *   });
 *   
 * @param  {String|Object} attr   
 * @param  {Function|Object} plugin 
 * @return {View}
 * @api public
 */

View.prototype.plug = function(attr, plugin) {
	if(typeof attr !== 'string') {
		utils.each(attr, function(name, obj) {
			this.plug(name, obj);
		}, this);
	}
	this.binding.add(attr, plugin);
	return this;
};


/**
 * Insert view's dom in HTML Element.
 * Applies bindings it it hasn't been done yet.
 * example:
 *
 *   view.insert('#maple');
 *   view.insert(node); //with node HTML Element
 * 
 * @param  {Element|string} el   
 * @param  {Boolean} bool true to apply only the plugins (not inteprolation)
 * @api public
 */

View.prototype.insert = function(el, bool) {
	//NOTE: should we do 2 level query selection for insert and html?
	this.binding.apply(this.dom, bool); //we should apply only once!
	if(typeof el === 'string') {
		el = document.querySelector(el);
	}
	el.appendChild(this.dom);
};
