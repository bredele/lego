
/**
 * Module dependencies.
 */

var fragment = require('fragment');
var Store = require('datastore');
var walk = require('domwalk');
var mouth = require('mouth');
var dom = require('stomach');
var many = require('many');


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
 *   var lego = brick('<button>');
 *   var lego = brick('<button>', data);
 * 
 * @param {String | Element?} tmpl
 * @param {Object?} data
 * @api public
 */

function Brick(tmpl, data) {
  Store.call(this, data);
  this.state = 'created';
  this.from(tmpl);
}


Brick.prototype = Store.prototype;


/**
 * Add state machine transition
 * aka hook.
 *
 * Listen to a change of state or
 * define a state transition callback.
 *
 * Examples:
 *
 *   // transition on event lock
 *   lego.hook('created', 'lock', 'locked');
 *   lego.emit('lock');
 *   
 *   // with callback
 *   lego.hook('created', 'lock', function() {
 *     // do something
 *   }, 'locked');
 * 
 * @param  {String}   before
 * @param  {String}   ev
 * @param  {Function?} cb
 * @param  {String?}   after
 * @return {this}
 * @api public
 */

Brick.prototype.hook = function(before, ev, cb, after) {
  if(typeof cb === 'string') {
    after = cb;
    cb = null;
  }
  var that = this;
  this.on(ev, function() {
    if(that.state === before) {
      cb && cb.apply(that, arguments);
      if(after) that.state = after;
    }
  });
  return this;
};


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
  this.el = (typeof tmpl === 'function') ?
    tmpl(this) :
    dom(tmpl, bool);
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
  if(this.el.hasAttribute(name)) binding.call(this, this.el, this.el.getAttribute(name));
  this.query('[' + name + ']', function(node) {
    binding.call(this, node, node.getAttribute(name));
  });
  return this;
});


/**
 * Query all nodes.
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


/**
 * Apply bindings on dom
 * element.
 *
 * @todo  benchmark if indexOf('$' ) - it
 * seems it doesn't change anything
 *
 * @note should render only once
 * 
 * @return {this}
 * @api public
 */

Brick.prototype.build = function() {
  var that = this;
  // @note use looping
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
};


/**
 * Bind DOM node wit data using
 * mouth template engine.
 *
 * @return {Element} node
 * @api private
 */

Brick.prototype.bind = function(node) {
  var data = this.data;
  var content = node.nodeValue;
  var compiled = mouth(content, data);
  var keys = compiled[1];
  var fn = function() {
    node.nodeValue = compiled[0](data);
  };
  fn();
  for(var l = keys.length; l--;) {
    this.on('change ' + keys[l], fn);
  }
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
  brick.build();
  this.query(name, function(node) {
    replace(node, brick.el);
    brick.query('content', function(content) {
      var select = content.getAttribute('select');
      if(select) {
        replace(content, node.querySelector(select));
      } else {
        replace(content, fragment([].slice.call(node.childNodes)));
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
  dom(el).appendChild(this.el);
};


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
