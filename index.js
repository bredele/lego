
/**
 * Module dependencies.
 */

var dom = require('stomach');
var mouth = require('mouth');
var walk = require('domwalk');
var Store = require('datastore');


/**
 * Expose 'brick'
 */

module.exports = function(tmpl, data, anchor) {
  if(data instanceof Element) {
    anchor = data;
    data = {};
  }
  var brick = new Brick(tmpl, data);
  if(anchor) brick.to(anchor);
  return brick;
};


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
  this.from(tmpl);
}


Brick.prototype = Store.prototype;


/**
 * Create brick dom element from
 * string or existing dom element.
 * 
 * @param  {String | Element}  tmpl
 * @param {Boolean?} bool clone node
 * @return {this}
 * @api public
 */

Brick.prototype.from = function(tmpl, bool) {
  this.el = dom(tmpl, bool);
  return this;
};


Brick.prototype.to = function(anchor) {
  dom(anchor).appendChild(this.el);
  return this;
};


/**
 * Bind DOM node with data using
 * mouth template engine.
 *
 * @return {Element} node
 * @api private
 */

Brick.prototype.bind = function(node) {
  var data = this.data;
  var compiled = mouth(node.nodeValue, data);
  var keys = compiled[1];
  var fn = function() {
    node.nodeValue = compiled[0](data);
  };
  fn();
  for(var l = keys.length; l--;) {
    this.on('change ' + keys[l], fn);
  }
  return this;
};


/**
 * Apply data bindings on brick dom
 * element.
 * 
 * @return {this}
 * @api public
 */

Brick.prototype.build = function() {
  var that = this;
  walk(this.el, function(node) {
    if(node.nodeType === 1) {
      var attrs = node.attributes;
      for(var i = 0, l = attrs.length; i < l; i++) {
        that.bind(attrs[i]);
      }
    } else {
      that.bind(node);
    }
  });
  return this;
};


/**
 * Add attribute binding.
 *
 * As seen below, a brick can bind
 * existing attributes, dataset or
 * custom attributes.
 *
 * Examples:
 *
 *   lego.attr('class', fn);
 *   lego.attr('awesome', fn);
 *   lego.attr('data-test', fn);
 *   lego.attr({
 *     class: fn,
 *     'data-test': cb
 *   });
 * 
 * @param  {String | Object} name 
 * @param  {Function?} binding
 * @return {this}
 * @api public
 */

Brick.prototype.attr = function(name, binding) {
  if(this.el.hasAttribute(name)) binding.call(this, this.el, this.el.getAttribute(name));
  this.query('[' + name + ']', function(node) {
    binding.call(this, node, node.getAttribute(name));
  });
  return this;
};


/**
 * Query all nodes inside a brick.
 *
 * Examples:
 *
 *  lego.query('input', function() {
 *    // do something
 *  })
 * 
 * @param {String} selector
 * @param {Function} cb
 * @api private
 */

Brick.prototype.query = function(selector, cb) {
  var els = this.el.querySelectorAll(selector);
  for(var i = 0, l = els.length; i < l; i++) {
    cb.call(this, els[i]);
  }
  return this;
};


