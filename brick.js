
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (module.definition) {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};

require.register("component~indexof@0.0.3", function (exports, module) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});

require.register("component~trim@0.0.1", function (exports, module) {

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

});

require.register("bredele~supplant@0.2.0", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var indexOf = require("component~indexof@0.0.3");
var trim = require("component~trim@0.0.1");
var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
var cache = {}; //should itbe in this?


/**
 * Expose 'Supplant'
 */

module.exports = Supplant;



/**
 * Get string identifiers.
 * 
 * @param  {String} str 
 * @return {Array} 
 * @api private
 */

function props(str) {
  //benchmark with using match and uniq array
  var arr = [];
  str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(/[a-zA-Z_]\w*/g, function(expr) {
      if(!~indexOf(arr, expr)) arr.push(expr);
    });
  return arr;
}


function fn(_) {
  return 'model.' + _;
}


/**
 * Prefix uniq identifiers with string
 * model.
 * 
 * @param  {String} str 
 * @api private
 */

function map(str) {
  var arr = props(str);
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~indexOf(arr, _)) return _;
    return fn(_);
  });
}


/**
 * Scope statement with object.
 * 
 * @param  {string} statement
 * @return {Function}
 * @api private      
 */

function scope(str) {
  return new Function('model', 'return ' + map(str));
}


/**
 * Supplant constructor.
 * @api public
 */

function Supplant() {
  this.match = /\{\{([^}]+)\}([^}]*)\}/g;
  this.filters = {};
}


/**
 * Variable substitution on string.
 *
 * @param {String} text
 * @param {Object} model
 * @return {String}
 * @api public
 */

Supplant.prototype.text = function(text, model) {
  var _this = this;
  return text.replace(this.match, function(_, expr, filters) {
    var val;
    //is there fast regex? may be use or
    if(/[\.\'\[\+\(\|]/.test(expr)) {
      var fn = cache[expr] = cache[expr] || scope(expr);
      val = fn(model) || '';
    } else {
      val = model[trim(expr)] || '';
    }
    if(filters) {
      var list = filters.split('|');
      for(var i = 1, l = list.length; i < l; i++) {
        var filter = _this.filters[trim(list[i])];
        if(filter) val = filter(val);
      }
    }
    return val;
  });
};


/**
 * Get uniq identifiers from string.
 * 
 * Examples:
 *
 *    .props('{{olivier + bredele}}');
 *    // => ['olivier', 'bredele']
 *
 * @param {String} text
 * @return {Array}
 * @api public
 */

Supplant.prototype.props = function(text) {
  var exprs = [];
  //NOTE: may be cache expression for text
  text.replace(this.match, function(_, expr){
    var val = trim(expr);
    if(!~indexOf(exprs, val)) exprs = exprs.concat(props(val));
  });
  return exprs;
};


/**
 * Add substitution filter.
 * 
 * Examples:
 *
 *    .filter('hello', function(str) {
 *      return 'hello ' + str;
 *    });
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Supplant}
 * @api public
 */

Supplant.prototype.filter = function(name, fn) {
  this.filters[name] = fn;
  return this;
};


//var exprs = expr.match(/([^|].*?)[^|](?=(?:\||$)(?!\|))/g);
//http://jsperf.com/split-vs-regexp-interpolation
//
//with split:
// var list = expr.split('|'),
//     val = model[trim(list.shift())] || '';
// for(var i = 0, l = list.length; i < l; i++) {
//  val = _this.filters[trim(list[i])](val)
// }
// return val;

//{{} | hello}

});

require.register("bredele~clone@master", function (exports, module) {

/**
 * Expose 'clone'
 * @param  {Object} obj 
 * @api public
 */

module.exports = function(obj) {
  var cp = null;
  if(obj instanceof Array) {
    cp = obj.slice(0);
  } else {
    //hasOwnProperty doesn't work with Object.create
    // cp = Object.create ? Object.create(obj) : clone(obj);
    cp = clone(obj);
  }
  return cp;
};


/**
 * Clone object.
 * @param  {Object} obj 
 * @api private
 */

function clone(obj){
  if(typeof obj === 'object') {
    var copy = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = clone(obj[key]);
      }
    }
    return copy;
  }
  return obj;
}
});

require.register("bredele~looping@1.1.1", function (exports, module) {

/**
 * Expose 'looping'
 */

module.exports = function(obj, fn, scope){
  scope = scope || this;
  if( obj instanceof Array) {
    array(obj, fn, scope);
  } else if(typeof obj === 'object') {
    object(obj, fn, scope);
  }
};


/**
 * Object iteration.
 * @param  {Object}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function object(obj, fn, scope) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn.call(scope, i, obj[i]);
    }
  }
}


/**
 * Array iteration.
 * @param  {Array}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function array(obj, fn, scope){
  for(var i = 0, l = obj.length; i < l; i++){
    fn.call(scope, i, obj[i]);
  }
}
});

require.register("component~emitter@1.1.2", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});

require.register("bredele~many@0.3.3", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var loop = require("bredele~looping@1.1.1");


/**
 * Expose many.
 *
 * Only works when the first argument of a function
 * is a string.
 *
 * Examples:
 *
 *   var fn = many(function(name, data) {
 *     // do something
 *   });
 *   
 *   fn('bar', {});
 *   fn({
 *     'foo' : {},
 *     'beep' : {}
 *   });
 *
 * @param {Function}
 * @return {Function} 
 * @api public
 */

module.exports = function(fn) {
	var many = function(str) {
		if(typeof str === 'object') loop(str, many, this);
		else fn.apply(this, arguments);
		return this;
	};
	return many;
};

});

require.register("bredele~datastore@1.0.5", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Emitter = require("component~emitter@1.1.2");
var clone = require("bredele~clone@master");
var each = require("bredele~looping@1.1.1");
var many = require("bredele~many@0.3.3");
try {
  var storage = window.localStorage;
} catch(_) {
  var storage = null;
}


/**
 * Expose 'Store'
 */

module.exports = Store;


/**
 * Store constructor.
 *
 * @param {Object} data
 * @api public
 */

function Store(data) {
  if(data instanceof Store) return data;
  this.data = data || {};
  this.formatters = {};
}


Emitter(Store.prototype);


/**
 * Set store attribute.
 * 
 * Examples:
 *
 *   //set
 *   .set('name', 'bredele');
 *   //update
 *   .set({
 *     name: 'bredele'
 *   });
 *   
 * @param {String} name
 * @param {Everything} value
 * @api public
 */

Store.prototype.set = many(function(name, value, strict) {
  var prev = this.data[name];
  if(prev !== value) {
    this.data[name] = value;
    if(!strict) this.emit('updated', name, value);
    this.emit('change', name, value, prev);
    this.emit('change ' + name, value, prev);
  }
});


/**
 * Get store attribute.
 * 
 * @param {String} name
 * @return {this}
 * @api public
 */

Store.prototype.get = function(name) {
  var formatter = this.formatters[name];
  var value = this.data[name];
  if(formatter) {
    value = formatter[0].call(formatter[1], value);
  }
  return value;
};

/**
 * Get store attribute.
 * 
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

Store.prototype.has = function(name) {
  return this.data.hasOwnProperty(name);
};


/**
 * Delete store attribute.
 * 
 * @param {String} name
 * @return {this}
 * @api public
 */

Store.prototype.del = function(name, strict) {
  //TODO:refactor this is ugly
  if(this.has(name)){
    if(this.data instanceof Array){
      this.data.splice(name, 1);
    } else {
      delete this.data[name]; //NOTE: do we need to return something?
    }
    if(!strict) this.emit('updated', name);
    this.emit('deleted', name, name);
    this.emit('deleted ' + name, name);
  }
  return this;
};


/**
 * Set format middleware.
 * 
 * Call formatter everytime a getter is called.
 * A formatter should always return a value.
 * 
 * Examples:
 *
 *   .format('name', function(val) {
 *     return val.toUpperCase();
 *   });
 *   
 * @param {String} name
 * @param {Function} callback
 * @param {Object} scope
 * @return {this}
 * @api public
 */

Store.prototype.format = function(name, callback, scope) {
  this.formatters[name] = [callback,scope];
  return this;
};


/**
 * Compute store attributes.
 * 
 * Examples:
 *
 *   .compute('name', function() {
 *     return this.firstName + ' ' + this.lastName;
 *   });
 *   
 * @param  {String} name
 * @param {Function} callback
 * @return {this}                
 * @api public
 */

Store.prototype.compute = function(name, callback) {
  //NOTE: I want something clean instaead passing the computed 
  //attribute in the function
  var str = callback.toString();
  var attrs = str.match(/this.[a-zA-Z0-9]*/g);

  this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)
  for(var l = attrs.length; l--;){
    this.on('change ' + attrs[l].slice(5), function(){
      this.set(name, callback.call(this.data));
    });
  }
  return this;
};


/**
 * Reset store
 * 
 * @param  {Object} data 
 * @return {this} 
 * @api public
 */

Store.prototype.reset = function(data, strict) {
  var copy = clone(this.data),
    length = data.length;
    this.data = data;

  each(copy, function(key, val){
    if(typeof data[key] === 'undefined'){
      if(!strict) this.emit('updated', key);
      this.emit('deleted', key, length);
      this.emit('deleted ' + key, length);
    }
  }, this);

  //set new attributes
  each(data, function(key, val){
    //TODO:refactor with this.set
    var prev = copy[key];
    if(prev !== val) {
      if(!strict) this.emit('updated', key, val);
      this.emit('change', key, val, prev);
      this.emit('change ' + key, val, prev);
    }
  }, this);
  return this;
};


/**
 * Loop through store data.
 * 
 * @param  {Function} cb   
 * @param  {[type]}   scope 
 * @return {this} 
 * @api public
 */

Store.prototype.loop = function(cb, scope) {
  each(this.data, cb, scope || this);
  return this;
};


/**
 * Pipe two stores (merge and listen data).
 * example:
 *
 *   .pipe(store);
 *   
 * note: pipe only stores of same type
 *
 * @param {Store} store 
 * @return {this} 
 * @api public
 */

Store.prototype.pipe = function(store) {
  store.set(this.data);
  this.on('updated', function(name, val) {
    if(val) return store.set(name, val);
    store.del(name);
  });
  return this;
};

/**
 * Synchronize with local storage.
 * 
 * @param  {String} name 
 * @param  {Boolean} bool save in localstore
 * @return {this} 
 * @api public
 */

Store.prototype.local = function(name, bool) {
  //TODO: should we do a clear for .local()?
  if(!bool) {
    storage.setItem(name, this.toJSON());
  } else {
    this.reset(JSON.parse(storage.getItem(name)));
  }
  return this;
};


/**
 * Use middlewares to extend store.
 * 
 * A middleware is a function with the store
 * as first argument.
 *
 * Examples:
 *
 *   store.use(plugin, 'something');
 * 
 * @param  {Function} fn 
 * @return {this}
 * @api public
 */

Store.prototype.use = function(fn) {
  var args = [].slice.call(arguments, 1);
  fn.apply(this, [this].concat(args));
  return this;
};


/**
 * Stringify model
 * @return {String} json
 * @api public
 */

Store.prototype.toJSON = function(replacer, space) {
  return JSON.stringify(this.data, replacer, space);
};

});

require.register("bredele~cement@0.3.2", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Store = require("bredele~datastore@1.0.5");
var indexOf = require("component~indexof@0.0.3");
var Supplant = require("bredele~supplant@0.2.0");


/**
 * Expose 'Cement'
 */

module.exports = Cement;


/**
 * Cement constructor.
 * 
 * @api public
 */

function Cement(model) {
  if(!(this instanceof Cement)) return new Cement(model);
  this.data(model);
  this.plugins = {};
  this.subs = new Supplant();
  this.listeners = [];
}


/**
 * Set data store.
 * 
 * @param  {Object} data 
 * @return {this}
 * @api public
 */

Cement.prototype.data = function(data) {
  this.model = new Store(data);
  return this;
};


/**
 * Add binding by name.
 * 
 * @param {String} name  
 * @param {Object} plugin 
 * @return {this}
 * @api public
 */

Cement.prototype.add = function(name, plugin) {
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

Cement.prototype.text = function(node, store) {
  var text = node.nodeValue;
  var _this = this;
  //we should do {{ but it doesn't work on ie
  if(!~ indexOf(text, '{')) return;

  var exprs = this.subs.props(text);
  var handle = function() {
    //should we cache a function?
    node.nodeValue = _this.subs.text(text, store.data);
  };

  handle();

  for(var l = exprs.length; l--;) {
    this.listeners.push(store.on('change ' + exprs[l], handle));
  }
};


/**
 * Apply bindings on a single node
 * 
 * @param  {Element} node 
 * @api private
 */

Cement.prototype.bind = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) {
    var attrs = node.attributes;
    for(var i = 0, l = attrs.length; i < l; i++) {
      var attr = attrs[i];
      var plugin = this.plugins[attr.nodeName];

      if(plugin) {
        plugin.call(this.model, node, attr.nodeValue);
      } else {
        this.text(attr, this.model);
      }
    }
    return;
  }
  // text node
  if (type === 3) this.text(node, this.model);
};


/**
 * Apply bindings on nested DOM element.
 * 
 * @param  {Element} node
 * @return {this}
 * @api public
 */

Cement.prototype.scan = function(node, bool) {
  if(bool) return this.query(node);
  var nodes = node.childNodes;
  this.bind(node);
  for (var i = 0, l = nodes.length; i < l; i++) {
    this.scan(nodes[i]);
  }
  return this;
};


/**
 * Query plugins and execute them.
 * 
 * @param  {Element} el 
 * @api private
 */

Cement.prototype.query = function(el) {
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
 * Unsubscribe to events.
 * 
 * @api public
 */

Cement.prototype.remove = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    this.model.off(listener[0],listener[1]);
  }
};

});

require.register("bredele~stomach@0.1.0", function (exports, module) {

/**
 * Stomach constructor.
 *
 * Generate dom from string or html
 * node.
 *
 * Examples:
 *
 *   stomach('<button>hello</button>');
 *   stomach('#hello');
 *   stomach(node);
 *   
 * @param {String | Element} tmpl
 * @return {Element}
 * @api public
 */

module.exports = function(tmpl) {
  if(typeof tmpl === 'string') {
     if(tmpl[0] === '<') {
       var div = document.createElement('div');
       div.insertAdjacentHTML('beforeend', tmpl);
       return div.firstChild;
     } 
     return document.querySelector(tmpl);
   }
   return tmpl;
};

});

require.register("brick", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Store = require("bredele~datastore@1.0.5");
var cement = require("bredele~cement@0.3.2");
var each = require("bredele~looping@1.1.1");
var many = require("bredele~many@0.3.3");


/**
 * Expose 'Brick'
 */

module.exports = Brick;


/**
 * Brick constructor.
 * 
 * Examples:
 * 
 *   var brick = require("brick");
 *   
 *   brick('<span>brick</span>');
 *   brick('<span>{{ label }}</span>', {
 *     label: 'brick'
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
 * Brick factory.
 *
 * Useful to reuse your bricks.
 * Examples:
 *
 *   var btn = brick.extend('<button i18n>{{ label }}</button>')
 *     .use(plugin)
 *     .add('i18n', lang());
 *
 *   var view = btn({
 *     label: 'my button'
 *   }).build();
 *   
 * @param  {[type]} tmpl [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */

Brick.extend = function(tmpl, data) {
  var plugins = [];
  var bindings = {};
  var factory = function(model) {
    var view = new Brick(tmpl, model || data);
    view.add(bindings);
    each(plugins, function(key, plugin) {
      view.use.apply(view, plugin);
    });
    return view;
  };

  factory.use = function(fn, opts) {
    plugins.push([fn, opts]);
    return factory;
  };

  //NOTE: add multiple
  factory.add = many(function(name, binding) {
    bindings[name] = binding;
  });

  return factory;
};


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

Brick.dom = require("bredele~stomach@0.1.0");


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
 * @return {this}
 * @api public
 */

Brick.prototype.add = many(function(name, plug) {
  this.bindings.add(name, plug);
});


/**
 * Filter brick.
 * 
 * @param  {String}   name
 * @param  {Function} fn
 * @return {this}
 * @api public 
 */

Brick.prototype.filter = many(function(name, fn) {
  this.bindings.subs.filter(name, fn);
});


/**
 * Render template into dom.
 * 
 * Examples:
 *
 *   view.dom('<span>brick</span>');
 *   view.dom(dom);
 *   view.dom('#id');
 *   
 * @param  {String|Element} tmpl
 * @return {this}
 * @event 'rendered' 
 * @api public
 */

Brick.prototype.dom = function(tmpl) {
  this.el = Brick.dom(tmpl);
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
 * @return {this}
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
 * @return {this}
 * @event 'before removed'
 * @event 'removed' 
 * @api public
 */

Brick.prototype.remove = function() {
  var parent = this.el.parentElement;
  this.emit('before removed');
  this.bindings.remove();
  if(parent) {
      parent.removeChild(this.el);
  }
  this.emit('removed');
  return this;
};

//partials, stack
});



if (typeof exports == "object") {  module.exports = require("brick");} else if (typeof define == "function" && define.amd) {  define([], function(){ return require("brick"); });} else {  this["brick"] = require("brick");}})()
