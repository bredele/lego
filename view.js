var Emitter = require('./emitter'),
		binding = require('./binding'),
		utils = require('./lib/utils'),
		actions = ['el', 'data','plug','html'];

/**
 * Expose 'View'
 */

module.exports = View;


/**
 * View constructor.
 * @api public
 */

function View(mixin) {
	if(!(this instanceof View)) return new View(mixin);
  this.dom = null;
  this.binding = binding();
	this.once('inserted', function() {
		this.emit('compiled');
		this.binding.apply(this.dom);
	}, this);
	
	if(mixin) {
		for(var l = actions.length; l--;) {
			var action = actions[l],
					val = mixin[action];

			if(val) {
				this[action](val);
				delete mixin[action];
			}
		}
		//TODO: could do better than delete
		utils.mixin(mixin, this);
	}
}


//TODO:  may be View.dom
//it could be great to have a static api
function dom(str) {
	//we should may be use fragment for memory leaks
	var frag = document.createElement('div');
	frag.insertAdjacentHTML('beforeend', str);
	return frag.firstChild;
}


//inherit from emitter

Emitter(View.prototype);


/**
 * Insert and compile.
 * A view is only compiled once.
 * example:
 *
 *   view.el(); //compile
 *   view.el(document.body) //insert and compile
 *   
 * @param  {Element} parent 
 * @return {View}
 * @api public
 */

View.prototype.el = function(parent) { //we should may be call insert?
  this.emit('inserted'); //faster to compile outside of the document
	if(parent) parent.appendChild(this.dom); //use cross browser insertAdjacentElement
	return this;
};


/**
 * Render view's dom.
 * 
 * @event {created}
 * @param  {String|Element} str
 * @param  {Object|Stire} data 
 * @return {View}
 * @api public
 */

View.prototype.html = function(str, data) {
	this.data(data);
	this.dom = (typeof str === 'string') ? dom(str) : str;
	this.emit('created'); //may be rendered
	return this;
};

/**
 * Set interpolation data.
 * 
 * @param  {Object|Store} data
 * @return {View}
 * @api public
 */

View.prototype.data = function(data) {
	//TODO: to test
	if(data) this.binding.data(data);
	return this;
};

/**
 * Add view's plugin.
 * example:
 * 
 *   view.plug('data-event', fn);
 *   view.plug({
 *     'data-event' : fn
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
	} else {
		this.binding.add(attr, plugin);
	}
	return this;
};


/**
 * Remove view's dom from its parent element
 * and remove bindings.
 * 
 * @event {removed}
 * @return {View}
 * @api public
 */

View.prototype.remove = function() {
	var parent = this.dom.parentElement;
	this.binding.unbind();
	if(parent) {
			this.emit('removed');
			parent.removeChild(this.dom);
	}
	return this;
};