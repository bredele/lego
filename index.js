
/**
 * Module dependencies.
 */

var Cement = require('cement');
var Store = require('datastore');
var mouth = require('mouth');
var many = require('many');
var dom = require('stomach');


/**
 * Expression cache.
 * @type {Object}
 */

var cache = {};


/**
 * Expose 'brick'
 */

module.exports = function(tmpl, data) {
  return new Brick(tmpl, data);
};


/**
 * Brick constructor.
 *
 * Examples:
 *
 *   var address = brick('<address>');
 *   var address = brick('<address>', data);
 * 
 * @param {String | Element?} tmpl
 * @param {Object?} data
 * @api public
 */

function Brick(tmpl, data) {
  Store.call(this, data);
  this.from(tmpl);
  this.cement = new Cement();
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
  this.tmpl = tmpl;
  this.el = dom(tmpl, bool);
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
 *   brick.attr('class', fn);
 *   brick.attr('awesome', fn);
 *   brick.attr('data-test', fn);
 *   brick.attr({
 *     class: fn,
 *     'data-test': cb
 *   })
 *
 * @note using closure is more
 * efficient than using native bind.
 * 
 * @param  {String} name 
 * @param  {Function} binding
 * @return {this}
 * @api public
 */

Brick.prototype.attr = many(function(name, binding) {
  var that = this;
  this.cement.bind(name, function(node, content) {
    binding.call(that, node, content);
  });
});


/**
 * Apply bindings on dom
 * element.
 *
 * @todo  benchmark if indexOf('$' ) - it
 * seems it doesn't change anything
 *
 * @note mold should render only once
 * 
 * @return {this}
 * @api public
 */

Brick.prototype.render = function() {
  var that = this;
  this.cement.render(this.el, function(content, node) {
    var compiled = mouth(content);
    var props = compiled.props;
    var fn = cache[content] = cache[content] || compiled.text;
    var handle = function() {
      node.nodeValue = fn(that.data);
    };
    handle();
    for(var l = props.length; l--;) {
      that.on('change ' + props[l], handle);
    }
  });
  return this;
};




/**
 * Return a new brick from
 * a brick current's state.
 *
 * Freeze is better than a simple extend.
 * You can freeze a living brick with
 * its data.
 *
 * Examples;
 *
 *   var vehicle = brick(tmpl, data)
 *     .attr('type', cb)
 *     .mold();
 *
 *   var car = vehicle();
 *   car.render();
 *
 *
 * @note mold is still experimental 
 * and will probably change a lot.
 *
 * @note should we clone the data
 * and pass t in the constructor
 * 
 * @return {Function} brick factory
 * @api public
 */

Brick.prototype.mold = function() {
  var that = this;
  return function(tmpl, obj) {
    var brick = new Brick();
    return brick
      .from(tmpl || that.tmpl, true)
      .set(that.data)
      .set(obj)
      .attr(that.cement.bindings);
  };
};


/**
 * Add custom element.
 *
 * Brick allows you to create your
 * own tags (with the web component
 * standard) or to override existing
 * one.
 *
 * Examples:
 *
 *   var list = brick('<div><user /></div>');
 *   var user = brick('<button></button>');
 *
 *   list.tag('user', user);
 *
 * @todo  custom element from freezed brick
 * @todo  custom element attribute binding 
 * (using compiler and cache)
 * 
 * @param  {String} name
 * @param  {Brick} brick
 * @return {this}
 */

Brick.prototype.tag = many(function(name, brick) {
  brick.render();
  elements(this.el, name, function(node) {
    var el = brick.el;
    replace(node, el);
    elements(el, 'content', function(content) {
      var select = content.getAttribute('select');
      if(select) {
        replace(content, node.querySelector(select));
      } else {
        replace(content, fragment(node));
      }
    });
  });
});


/**
 * Append brick to
 * dom element.
 *
 * Examples:
 *
 *   // dom element
 *   var foo = brick(tmpl);
 *   foo.to(document.body);
 *
 *   // query selector
 *   var bar = brick(tmpl);
 *   bar.to('.article');
 * 
 * @param  {Element | String} el
 * @return {this}
 * @api public
 */

Brick.prototype.to = function(el) {
  this.render();
  dom(el).appendChild(this.el);
};


/**
 * Get elements by 
 * tag name.
 * 
 * @param  {Element}   el
 * @param  {String}   name
 * @param  {Function} fn 
 * @api private
 */

function elements(el, name, fn) {
  var nodes = el.getElementsByTagName(name);
  for(var i = 0, l = nodes.length; i < l; i++) {
    fn(nodes[i]);
  }
}


/**
 * Wrap node child nodes
 * into a fragment.
 *
 * @todo should also work
 * with simple node.
 * 
 * @param  {Element} node
 * @return {DocumentFragment}
 * @api private
 */

function fragment(node) {
  var nodes = node.childNodes;
  var frag = document.createDocumentFragment();
  for(var l = nodes.length; l--;) {
    frag.appendChild(nodes[0]);
  }
  return frag;
}


/**
 * Replace one node with another.
 *
 * @note benchmark vs remove/insertBefore
 * 
 * @param {Element} old
 * @param {Element} el
 * @api private
 */

function replace(old, el) {
  old.parentNode.replaceChild(el, old);
}
