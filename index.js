
/**
 * Module dependencies.
 */

var Store = require('datastore');
var Cement = require('cement');
var many = require('many');
var mouth = require('mouth');


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
  this.dom(tmpl);
  this.cement = new Cement();
}


Brick.prototype = Store.prototype;


/**
 * Transform amything into dom.
 *
 * Examples:
 *
 *   brick.dom('<span>content</span>');
 *   brick.dom(el);
 *   brick.dom('.myEl');
 * 
 * @param  {String|Element} tmpl
 * @return {Element}
 * @api public
 */

Brick.dom = require('stomach');


/**
 * Create brick dom element from
 * string or existing dom element.
 * 
 * @param  {String | Element}  arg 
 * @return {this}
 * @api public
 */

Brick.prototype.dom = function(arg) {
  this.tmpl = arg;
  this.el = Brick.dom(arg);
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
 * @return {this}
 * @api public
 */

Brick.prototype.build = function() {
  var that = this;
  this.cement.render(this.el, function(content, node) {
    // check if cached and don't need to compile
    // if not cached, cache a new function if complex
    // expression otherwise just get data from model.

    //@note benchmark indexOf('$') it seems it doesn't change anything
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
 *     .freeze();
 *
 *   var car = vehicle();
 *   car.build();
 *
 *
 * @note freeze is still experimental 
 * and will probably change a lot.
 *
 * @note should we return a factory
 * or the a new brick right away?
 * 
 * @return {Function} brick factory
 * @api public
 */

Brick.prototype.freeze = function() {
  var data = this.data;
  var bindings = this.cement.bindings;
  var dom = this.tmpl;
  if(this.tmpl.cloneNode) dom = this.tmpl.cloneNode(true);

  return function(tmpl, obj) {
    var brick = new Brick(tmpl || dom);
    // @note we should clone data and pass in constructor
    brick.set(data);
    brick.set(obj);
    brick.attr(bindings);
    return brick;
  };
};


Brick.prototype.tag = function(name, brick) {
  // on devrait checker si brick a un element
  // si non, est-ce qu'on devrait ecouter
  // un evenement pour savoir quan?

  // note1: should we do right away or wait for the
  // build
  var nodes = this.el.querySelectorAll(name);

  // step1 (replace custom element)
  for(var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    // note2: replace or insert (to test)
    var parent = node.parentNode;
    parent.replaceChild(brick.el, node);

    // step2
    var contents = brick.el.querySelectorAll('content');
    // on devrait avoir une methide qui prend un tag name
    // et une fonction (comme va on se repete pas avec le loop)
    for(var j = 0, h = contents.length; j < h; j++) {
      var content = contents[j];
      var fragment = document.createDocumentFragment();
      var children = node.childNodes;
      console.log(children);

      // note pn devrait peut etre faire ca de facon
      // recursive, je pense c'estp lus rapide
      // aussi regarder si children.item(0) est
      // plus rapide
      for(var k = 0, g = children.length; k < g; k++) {
        fragment.appendChild(children[0]);
      }
      content.parentNode.replaceChild(fragment, content);
    }
  }

};


// this.el(); retourne host
// this.el('.query'); retourne queryselector
// this.el('tag', fn); applique une fonction sur l'element