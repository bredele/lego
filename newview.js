var Emitter = require('./emitter'),
		binding = require('./binding');

/**
 * Expose 'View'
 */

module.exports = View;


/**
 * View constructor.
 * @api public
 */

function View() {
  this.dom = null;
  this.binding = binding();
  this.once('inserted', function() {
		this.emit('compiled');
		this.binding.apply(this.dom);
  }, this);
}


Emitter(View.prototype);


View.prototype.el = function(parent) {
  this.emit('inserted'); //faster to compile outside of the document
	if(parent) parent.appendChild(this.dom);
	return this;
};

function query(str) {
	//we should may be use fragment for memory leaks
	var frag = document.createElement('div');
	frag.insertAdjacentHTML('beforeend', str);
	return frag.firstChild;
}


View.prototype.html = function(str, data) {
	if(data) this.binding.data(data);
	this.dom = (typeof str === 'string') ? query(str) : str;
	this.emit('created'); //may be rendered
	return this;
};

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

View.prototype.remove = function() {
	
};