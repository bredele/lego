
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


Brick.prototype.from = function(tmpl) {
  this.el = dom(tmpl);
  return this;
};

Brick.prototype.to = function(anchor) {
  anchor.appendChild(this.el);
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

