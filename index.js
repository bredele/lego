/**
 * Brick dependencies
 */

var Store = require('datastore')
var walk = require('domwalk')
var append = require('regurgitate')


/**
 * Compilation regexps.
 */

var expressions = /(\$|\#)\{([^{}]*)\}/g
var parser = /\.\w+|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g


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
 * Build a brick by replacing inerpolation expressions
 * with brick data.
 * 
 * @return {this}
 * @api public
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
 * Bind node (type 1 or 3) with brick data.
 *
 * Node containing `${}` expressions will be updated 
 * whenever the brick data changes.
 * 
 * @param  {Node} node 
 * @return {this}
 * @api public      
 */

Brick.prototype.bind = function(node) {
  var model = this;
  var parent = node.parentElement
  var str = node.nodeValue
  node.nodeValue = ''
  var idx = 0
  str.replace(expressions, function(_, type, expr, i) {
    parent.appendChild(document.createTextNode(str.substring(idx, i)))
    update(parent, model, expr, type == '$')
    idx = i + _.length
  });
  return this
};


/**
 * Update node whenever model data changes.
 *
 * @note the node value of a text node when the data changes
 * should be transformed (stream, promises, etc)
 *
 * @param {Node} node
 * @param {Store} model
 * @param {String} expr
 * @param {Boolean} bool
 * @api private
 */

function update(node, model, expr, bool) {
  var list = []
  var cb = compile(expr, list)
  var el = append(node, cb(model.data))
  if(bool) {
    list.map(function(name) {
      model.on('change ' + name, function() {
        el.nodeValue = cb(model.data)
      })
    });
  }
}

/**
 * Compile expression by replacing identifiers.
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

function compile(str, arr) {
  return new Function('model', 'return ' + str.replace(parser, function(expr) {
    if(forbidden.indexOf(expr[0]) > -1) return expr;
    if(!~arr.indexOf(expr)) arr.push(expr);
    return 'model.' + expr;
  }));
}