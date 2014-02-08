var Emitter = require('./emitter');

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
  this.once('inserted', function() {
  	this.emit('compiled');
  }, this);
}

Emitter(View.prototype);


View.prototype.el = function(parent) {
	if(parent) parent.appendChild(this.dom);
	this.emit('inserted');
};

function query(str) {
	//we should may be use fragment for memory leaks
	var frag = document.createElement('div');
	frag.insertAdjacentHTML('beforeend', str);
	return frag.firstChild;
}

View.prototype.html = function(str) {
	this.dom = (typeof str === 'string') ? query(str) : str;
	this.emit('created');
};

View.prototype.plug = function() {
	
};

View.prototype.remove = function() {
	
};