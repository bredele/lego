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
}


Emitter(View.prototype);


View.prototype.el = function(parent) {
	parent.appendChild(this.dom);
	this.emit('inserted');
};

function query(str) {
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