
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

module.exports = brick;


/**
 * brick constructor.
 * @api public
 */

function brick(tmpl, data) {
  return new Brick(tmpl, data);
}


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
  return this;
});


/**
 * Apply bindings on dom
 * element.
 *
 * @todo  benchmark if indexOf('$' ) - it
 * seems it doesn't change anything
 * 
 * @return {this}
 * @api public
 */

Brick.prototype.mold = function() {
  var that = this;
  this.cement.render(this.el, function(content, node) {
    // @note si cache existe on devrait pas
    // faire mouth(content);
    var compiled = mouth(content);
    var props = compiled.props;
    var fn = cache[content] = cache[content] || compiled.text;
    // la premier fois on devrait avoir le rendu 
    // et apres on appelle la fonction pour chaque prop
    // immediat anonuymous call?
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
 *     .freeze();
 *
 *   var car = vehicle();
 *   car.mold();
 *
 *
 * @note freeze is still experimental 
 * and will probably change a lot.
 *
 * @note should we clone the data
 * and pass t in the constructor
 * 
 * @return {Function} brick factory
 * @api public
 */

Brick.prototype.freeze = function() {
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
  // note is internal state machine, if has been built will do nothing
  brick.mold();

  loop(this.el.getElementsByTagName(name), function(node) {
    var el = brick.el;
    replace(node, el);
    loop(el.getElementsByTagName('content'), function(content) {
      var select = content.getAttribute('select');
      if(select) {
        replace(content, node.querySelector(select));
      } else {
        // note on pourrair avoir une methode fragmen
        var fragment = document.createDocumentFragment();
        var children = node.childNodes;
        for(var k = 0, g = children.length; k < g; k++) {
          fragment.appendChild(children[0]);
        }
        replace(content, fragment);
      }
    });
  });

  return this;
});


function loop(nodes, fn) {
  for(var i = 0, l = nodes.length; i < l; i++) {
    fn(nodes[i]);
  }
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
