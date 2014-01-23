var Store = require('./store'),
    utils = require('./lib/utils'),
    supplant = require('./lib/supplant');

/**
 * Expose 'Binding'
 */

module.exports = Binding;


/**
 * Binding constructor.
 * 
 * @api public
 */

function Binding(model) {
	if(!(this instanceof Binding)) return new Binding(model);
  this.data(model);
	this.plugins = {};
  this.listeners = [];
}

//TODO: this is for view, instead doing this.binding.model = new Store();
//should we keep this or not?

Binding.prototype.data = function(data) {
  this.model = new Store(data);
  return this;
};


//todo: make better parser and more efficient
function parser(str) {
    //str = str.replace(/ /g,'');
    var phrases = str ? str.split(';') : ['main'];
    var results = [];
    for(var i = 0, l = phrases.length; i < l; i++) {
      var expr = phrases[i].split(':');

      var params = [];
      var name = expr[0];

      if(expr[1]) {
        var args = expr[1].split(',');
        for(var j = 0, h = args.length; j < h; j++) {
          params.push(utils.trim(args[j]));
        }
      } else {
        name = 'main'; //doesn't do anything
      }

      results.push({
        method: utils.trim(expr[0]),
        params: params
      });
    }
    return results;
  }


/**
 * Bind object as function.
 * 
 * @api private
 */

function binder(obj) {
  var fn = function(el, expr) {
    var formats = parser(expr);
    for(var i = 0, l = formats.length; i < l; i++) {
      var format = formats[i];
      format.params.splice(0, 0, el);
      obj[format.method].apply(obj, format.params);
    }
  };
  //TODO: find something better
  fn.destroy = function() {
    obj.destroy && obj.destroy();
  };
  return fn;
}


/**
 * Add binding by name
 * 
 * @param {String} name  
 * @param {Object} plugin 
 * @return {Binding}
 * @api public
 */

Binding.prototype.add = function(name, plugin) {
  if(typeof plugin === 'object') plugin = binder(plugin);
  this.plugins[name] = plugin;
  return this;
};


/**
 * Substitue node text with data.
 * 
 * @param  {HTMLElement} node  type 3
 * @param  {Store} store 
 * @api private
 */

Binding.prototype.subs = function(node, store) {
  var text = node.nodeValue;
  if(!~ utils.indexOf(text, '{')) return;

  var exprs = supplant.attrs(text),
      handle = function() {
        //should we cache a function?
        node.nodeValue = supplant(text, store.data);
      };

  handle();

  for(var l = exprs.length; l--;) {
    this.listeners.push(store.on('change ' + exprs[l], handle));
  }
};


/**
 * Attribute binding.
 * 
 * @param  {HTMLElement} node 
 * @api private
 */

Binding.prototype.bindAttrs = function(node) {
  var attrs = node.attributes;
  for(var i = 0, l = attrs.length; i < l; i++) {
    var attr = attrs[i],
        plugin = this.plugins[attr.nodeName];

    if(plugin) {
      plugin.call(this.model, node, attr.nodeValue);
    } else {
      this.subs(attr, this.model);
    }
  }
};


/**
 * Apply binding's on a single node
 * 
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.bind = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) return this.bindAttrs(node);
  // text node
  if (type === 3) this.subs(node, this.model);
};


/**
 * Apply bindings on nested DOM element.
 * 
 * @param  {DomElement} node
 * @return {Binding}
 * @api public
 */

Binding.prototype.apply = function(node, bool) { //TODO: change api, call bind
  if(bool) return this.query(node);
  var nodes = node.childNodes;
  this.bind(node);
  for (var i = 0, l = nodes.length; i < l; i++) {
    this.apply(nodes[i]);
  }
  return this;
};


/**
 * Query plugins and execute them.
 * 
 * @param  {Element} el 
 * @api private
 */

Binding.prototype.query = function(el) {
  //TODO: refactor
  var parent = el.parentElement;
  if(!parent) {
    parent = document.createDocumentFragment();
    parent.appendChild(el);
  }
  for(var name in this.plugins) {
    var nodes = parent.querySelectorAll('[' + name + ']');
    for(var i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      this.plugins[name].call(this.model, node, node.getAttribute(name));
    }
  }
};


/**
 * Destroy binding's plugins and unsubscribe
 * to emitter.
 * 
 * @api public
 */

Binding.prototype.unbind = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    this.model.off(listener[0],listener[1]);
  }

  for(var name in this.plugins) {
    var plugin = this.plugins[name];
    plugin.destroy && plugin.destroy();
  }
};
