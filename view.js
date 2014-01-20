var Binding = require('./binding'),
    Store = require('./store');


/**
 * Expose 'View'
 */

module.exports = View;


/**
 * View constructor.
 * We keep the constructor clean for override.
 * @api public
 */

function View(){
  this.dom = null;
  this.store = null;
  this.binding = new Binding();
}

/**
 * String to DOM.
 * @api pruvate
 */

function domify(tmpl){
  //ie8 doesn't support instanceof if left assignment not an object
  if(typeof tmpl !== 'string') return tmpl;
  //may be by applying binding on this node we can have multiple
  //children
  var div = document.createElement('div');
  //use component insert
  div.innerHTML = tmpl;
  return div.firstChild;
}


/**
 * Turn HTML into DOM with data store.
 * The template is either a string or 
 * an existing HTML element.
 * @param  {String|HTMLElement|Function} tmpl  
 * @param  {Object} store can be nothing, an object or a store
 * @api public
 */

View.prototype.html = function(tmpl, store) { //add mixin obj?
  if(typeof tmpl === 'function') {
    //TODO: use component to array
    this.dom = tmpl.apply(null, [].slice.call(arguments, 1));
  } else {
    this.store = new Store(store);
    this.binding.model = this.store;
    this.dom = domify(tmpl);
  }
  return this;
};


/**
 * Add attribute binding plugin.
 * @param  {String} name 
 * @param  {Object | Function} plug 
 * @return {View}
 * @api public
 */

View.prototype.attr = function(name, plug) {
  this.binding.add(name, plug);
  return this;
};


/**
 * Add binding plugin.
 * @param  {String} name 
 * @param  {Object | Function} plug 
 * @return {View}
 * @api public
 */

View.prototype.data = function(name, plug) {
  return this.attr('data-' + name, plug);
};


/**
 * Place widget in document.
 * @param {HTMLElement} node
 * @api public
 */

View.prototype.insert = function(node) {
  this.alive();
  node.appendChild(this.dom);
};


/**
 * Apply data-binding on dom.
 * @param {HTMLElement} node widget's dom if undefined
 * @api publi
 */

View.prototype.alive = function(node) {
  //do we want to apply multiple times? no
  if(node) this.dom = node;
  this.binding.apply(this.dom);
};


/**
 * Call the destroy method for every registered plugin.
 * 
 * @api public
 */

View.prototype.destroy = function() {
  var parent = this.dom.parentNode;
  this.binding.unbind();
  if(parent) parent.removeChild(this.dom);

};