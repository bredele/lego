
/**
 * Module dependencies.
 * @api private
 */

var Store = require('datastore');
var cement = require('cement');
var each = require('bredele-each');


/**
 * Expose 'Lego'
 */

module.exports = Brick;


/**
 * Brick constructor.
 * 
 * Examples:
 * 
 *   var lego = require('lego');
 *   
 *   lego('<span>lego</span>');
 *   lego('<span>{{ label }}</span>', {
 *     label: 'lego'
 *   });
 *
 * @event 'before ready'
 * @event 'ready' 
 * @api public
 */

function Brick(tmpl, data) {
 if(!(this instanceof Brick)) return new Brick(tmpl, data);
 //Store.call(this);
 this.data = data || {};

 //refactor binding
 this.bindings = cement();
 this.bindings.model = this;
 
 this.formatters = {};
 this.el = null;
 this.dom(tmpl);
 this.once('before inserted', function(bool) {
  this.emit('before ready');
  this.bindings.scan(this.el, bool);
  this.emit('ready');
 }, this);
}


//mixin

Brick.prototype = Store.prototype;



/**
 * Add attribure binding.
 * 
 * Examples:
 *
 *   view.add('on', event(obj));
 *   view.add({
 *     'on' : event(obj).
 *     'repeat' : repeat()
 *   });
 *   
 * @param {String|Object} name
 * @param {Function} plug 
 * @return {Brick}
 * @api public
 */

Brick.prototype.add = function(name, plug) {
  if(typeof name !== 'string') {
    each(name, this.add, this);
  } else {
    this.bindings.add(name, plug);
    if(plug.init) plug.init(this);
  }
  return this;
};


/**
 * Filter brick.
 * 
 * @param  {String}   name
 * @param  {Function} fn
 * @return {Brick}
 * @api public 
 */

Brick.prototype.filter = function(name, fn) {
  if(typeof name!== 'string') {
    each(name, this.filter, this);
  } else {
    this.bindings.subs.filter(name, fn);
  }
  return this;
};


/**
 * Render template into dom.
 * 
 * Examples:
 *
 *   view.dom('<span>lego</span>');
 *   view.dom(dom);
 *   
 * @param  {String|Element} tmpl
 * @return {Brick}
 * @event 'rendered' 
 * @api public
 */

Brick.prototype.dom = function(tmpl) {
  if(typeof tmpl === 'string') {
    var div = document.createElement('div');
    div.insertAdjacentHTML('beforeend', tmpl);
    this.el = div.firstChild;
  } else {
    this.el = tmpl;
  }
  this.emit('rendered');
  return this;
};


/**
 * Substitute variable and apply
 * attribute bindings.
 * 
 * Examples:
 *
 *    view.build();
 *    view.build(el);
 *
 *    //only apply attribute bindings
 *    view.build)(el, true);
 *    
 * @param  {Element} parent
 * @param {Boolean} query
 * @return {Brick}
 * @event 'before inserted'
 * @event 'inserted' 
 * @api public
 */

Brick.prototype.build = function(parent, query) {
  if(this.el) {
    this.emit('before inserted', query); //should we pass parent?
    if(parent) {
      parent.appendChild(this.el); //use cross browser insertAdjacentElement
      this.emit('inserted');
    }
  }
  return this;
};


/**
 * Remove attribute bindings, store
 * listeners and remove dom.
 * 
 * @return {Brick}
 * @event 'before removed'
 * @event 'removed' 
 * @api public
 */

Brick.prototype.remove = function() {
  var parent = this.el.parentElement;
  this.emit('before removed');
  this.bindings.remove();
  if(parent) {
      //this.emit('removed');
      parent.removeChild(this.el);
  }
  this.emit('removed');
  return this;
};

//partials, directive