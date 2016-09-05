/**
 * Brick dependencies
 */

var Store = require('datastore')


/**
 * Expose 'brick'
 */

module.exports = function(tmpl, data) {
  return new Brick(tmpl, data)
}


/**
 * Brick constructor.
 *
 * Examples:
 *
 *   var lego = brick('<button>');
 *   var lego = brick('<button>', data);
 *
 * @param {String | Element?} tmpl
 * @param {Object?} data
 * @api public
 */

function Brick(tmpl, data) {
  Store.call(this, data || {});
  this.from(tmpl)
}


Brick.prototype = Store.prototype;


/**
 * Create brick element.
 * 
 * @param  {Element|String} tmpl 
 * @return {this}
 * @api public      
 */

Brick.prototype.from = function(str) {
  if(typeof str === 'string') {
    if(str.indexOf('<') > -1 ) {
      var div = document.createElement('div')
      div.innerHTML = str
      str = div.children[0]
    } else str = document.querySelector(str)
  }
  this.el = str
  return this
};


/**
 * Bind attribute with function.
 * 
 * @param  {String}   name 
 * @param  {Function} fn   
 * @return {this}
 * @api public     
 */

Brick.prototype.attr = function(name, fn) {
  var nodes = this.el.querySelectorAll('[' + name + ']')
  if(this.el.hasAttribute(name)) fn.call(this, this.el, this.el.getAttribute(name))
  for(var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i]
    fn.call(this, node, node.getAttribute(name))
  }
  return this
};
