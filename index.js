/**
 * Brick dependencies
 */

var Store = require('datastore')
var walk = require('domwalk')
var append = require('regurgitate')


/**
 * Compilation regexp.
 */

var reg = /\.\w+|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g


/**
 * Compilation forbidden special characters.
 * @type {Array}
 */

var forbidden = ['"', '.'];


/**
 * Expose 'brick'
 */

module.exports = function(tmpl, data) {
  return new Brick(tmpl, data)
    .build()
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


/**
 * [build description]
 * @return {[type]} [description]
 */
Brick.prototype.build = function() {
  var that = this
  // or el by default should be fragment?
  if(this.el) {
    walk(this.el, function(node) {
      if(node.nodeType !== 1) {
        that.bind(node)
      }
    })
  }
  return this
};



/**
 * [bind description]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */

Brick.prototype.bind = function(node) {
  var model = this;
  var parent = node.parentElement
  var str = node.nodeValue
  node.nodeValue = ''
  var idx = 0
  str.replace(/(\$|\#)\{([^{}]*)\}/g, function(_, type, expr, i) {
    //var value = model.get(expr)
    var list = []
    var fn = new Function('model', 'return ' + parse(expr, list))
    parent.appendChild(document.createTextNode(str.substring(idx, i)))
    var el = append(parent, fn(model.data))
    list.map(function(name) {
      model.on('change ' + name, function() {
        el.nodeValue = fn(model.data)
      })
    });
    idx = i + _.length
  });
  return this
};


/**
 * Parse expression and replace
 * identifier.
 *
 * Examples:
 *
 *   compile('name + last');
 *   // => model.name + model.last
 *
 *   compile('name[0]');
 *   // => model.name[0]
 *   
 * @param  {String} str
 * @param  {Array} arr
 * @return {String}
 * @api private
 */

function parse(str, arr) {
  return str.replace(reg, function(expr) {
    if(forbidden.indexOf(expr[0]) > -1) return expr;
    if(!~arr.indexOf(expr)) arr.push(expr);
    return 'model.' + expr;
  });
}