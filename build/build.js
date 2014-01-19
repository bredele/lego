
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};

require.register("bredele-maple/maple.js", Function("exports, require, module",
"\n\
/**\n\
 * Modules dependencies. \n\
 */\n\
\n\
var App = require('./lib/app'),\n\
    utils = require('./lib/utils');\n\
\n\
\n\
var cache = [];\n\
\n\
\n\
/**\n\
 * Expose maple()\n\
 */\n\
\n\
module.exports = maple;\n\
\n\
\n\
/**\n\
 * Create a maple application.\n\
 *\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
function maple() {\n\
        var app = new App();\n\
        for(var i = 0, l = cache.length; i < l; i++) {\n\
                utils.mixin(app, cache[i]);\n\
        }\n\
        return app;\n\
}\n\
\n\
\n\
/**\n\
 * Merge every application with passed object.\n\
 * It can be really useful to extend the api (ex:superagent)\n\
 * \n\
 * @param  {Object} obj \n\
 * @api public\n\
 */\n\
\n\
maple.merge = function() {\n\
        cache = utils.array(arguments);\n\
        return this;\n\
};//@ sourceURL=bredele-maple/maple.js"
));
require.register("bredele-maple/view.js", Function("exports, require, module",
"var Binding = require('./binding'),\n\
    Store = require('./store');\n\
\n\
\n\
/**\n\
 * Expose 'View'\n\
 */\n\
\n\
module.exports = View;\n\
\n\
\n\
/**\n\
 * View constructor.\n\
 * We keep the constructor clean for override.\n\
 * @api public\n\
 */\n\
\n\
function View(){\n\
  this.dom = null;\n\
  this.store = null;\n\
  this.binding = new Binding();\n\
}\n\
\n\
/**\n\
 * String to DOM.\n\
 * @api pruvate\n\
 */\n\
\n\
function domify(tmpl){\n\
  //ie8 doesn't support instanceof if left assignment not an object\n\
  if(typeof tmpl !== 'string') return tmpl;\n\
  //may be by applying binding on this node we can have multiple\n\
  //children\n\
  var div = document.createElement('div');\n\
  //use component insert\n\
  div.innerHTML = tmpl;\n\
  return div.firstChild;\n\
}\n\
\n\
\n\
/**\n\
 * Turn HTML into DOM with data store.\n\
 * The template is either a string or \n\
 * an existing HTML element.\n\
 * @param  {String|HTMLElement|Function} tmpl  \n\
 * @param  {Object} store can be nothing, an object or a store\n\
 * @api public\n\
 */\n\
\n\
View.prototype.html = function(tmpl, store) { //add mixin obj?\n\
  if(typeof tmpl === 'function') {\n\
    //TODO: use component to array\n\
    this.dom = tmpl.apply(null, [].slice.call(arguments, 1));\n\
  } else {\n\
    this.store = new Store(store);\n\
    this.binding.model = this.store;\n\
    this.dom = domify(tmpl);\n\
  }\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Add attribute binding plugin.\n\
 * @param  {String} name \n\
 * @param  {Object | Function} plug \n\
 * @return {View}\n\
 * @api public\n\
 */\n\
\n\
View.prototype.attr = function(name, plug) {\n\
  this.binding.add(name, plug);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Add binding plugin.\n\
 * @param  {String} name \n\
 * @param  {Object | Function} plug \n\
 * @return {View}\n\
 * @api public\n\
 */\n\
\n\
View.prototype.data = function(name, plug) {\n\
  return this.attr('data-' + name, plug);\n\
};\n\
\n\
\n\
/**\n\
 * Place widget in document.\n\
 * @param {HTMLElement} node\n\
 * @api public\n\
 */\n\
\n\
View.prototype.insert = function(node) {\n\
  this.alive();\n\
  node.appendChild(this.dom);\n\
};\n\
\n\
\n\
/**\n\
 * Apply data-binding on dom.\n\
 * @param {HTMLElement} node widget's dom if undefined\n\
 * @api publi\n\
 */\n\
\n\
View.prototype.alive = function(node) {\n\
  //do we want to apply multiple times? no\n\
  if(node) this.dom = node;\n\
  this.binding.apply(this.dom);\n\
};\n\
\n\
\n\
/**\n\
 * Call the destroy method for every registered plugin.\n\
 * \n\
 * @api public\n\
 */\n\
\n\
View.prototype.destroy = function() {\n\
  var plugins = this.binding.plugins,\n\
      parent = this.dom.parentNode;\n\
  //has own properties?\n\
  for(var name in plugins) {\n\
    var plugin = plugins[name];\n\
    plugin.destroy && plugin.destroy();\n\
  }\n\
  if(parent) parent.removeChild(this.dom);\n\
\n\
};//@ sourceURL=bredele-maple/view.js"
));
require.register("bredele-maple/store.js", Function("exports, require, module",
"var Emitter = require('./emitter'),\n\
\t\tutils = require('./lib/utils'),\n\
\t\tstorage = window.localStorage;\n\
\n\
/**\n\
 * Expose 'Store'\n\
 */\n\
\n\
module.exports = Store;\n\
\n\
\n\
/**\n\
 * Store constructor\n\
 * @api public\n\
 */\n\
\n\
function Store(data) {\n\
  if(data instanceof Store) return data;\n\
  this.data = data || {};\n\
  this.formatters = {};\n\
}\n\
\n\
\n\
Emitter(Store.prototype);\n\
\n\
\n\
/**\n\
 * Set store attribute.\n\
 * \n\
 * @param {String} name\n\
 * @param {Everything} value\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.set = function(name, value) {\n\
  var prev = this.data[name];\n\
  if(prev !== value) {\n\
    this.data[name] = value;\n\
    this.emit('change', name, value, prev);\n\
    this.emit('change ' + name, value, prev);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Get store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.get = function(name) {\n\
  var formatter = this.formatters[name];\n\
  var value = this.data[name];\n\
  if(formatter) {\n\
    value = formatter[0].call(formatter[1], value);\n\
  }\n\
  return value;\n\
};\n\
\n\
\n\
/**\n\
 * Get store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api private\n\
 */\n\
\n\
Store.prototype.has = function(name) {\n\
  return this.data.hasOwnProperty(name);\n\
};\n\
\n\
\n\
/**\n\
 * Delete store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.del = function(name) {\n\
  //TODO:refactor this is ugly\n\
  if(this.has(name)){\n\
    if(this.data instanceof Array){\n\
      this.data.splice(name, 1);\n\
    } else {\n\
      delete this.data[name]; //NOTE: do we need to return something?\n\
    }\n\
    this.emit('deleted', name, name);\n\
    this.emit('deleted ' + name, name);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Compute store attributes\n\
 * @param  {String} name\n\
 * @return {Function} callback                \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.compute = function(name, callback) {\n\
  var str = callback.toString();\n\
  var attrs = str.match(/this.[a-zA-Z0-9]*/g);\n\
\n\
  this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)\n\
  for(var l = attrs.length; l--;){\n\
    this.on('change ' + attrs[l].slice(5), function(){\n\
      this.set(name, callback.call(this.data));\n\
    });\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Set format middleware.\n\
 * Call formatter everytime a getter is called.\n\
 * A formatter should always return a value.\n\
 * \n\
 * @param {String} name\n\
 * @param {Function} callback\n\
 * @param {Object} scope\n\
 * @return this\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.format = function(name, callback, scope) {\n\
  this.formatters[name] = [callback,scope];\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Reset store\n\
 * @param  {Object} data \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.reset = function(data) {\n\
\tvar copy = utils.clone(this.data),\n\
\t    length = data.length;\n\
\n\
\tthis.data = data;\n\
\n\
\tutils.each(copy, function(key, val){\n\
\t\tif(typeof data[key] === 'undefined'){\n\
\t\t\tthis.emit('deleted', key, length);\n\
\t\t\tthis.emit('deleted ' + key, length);\n\
\t\t}\n\
\t}, this);\n\
\n\
  //set new attributes\n\
  utils.each(data, function(key, val){\n\
  \tvar prev = copy[key];\n\
  \tif(prev !== val) {\n\
  \t\tthis.emit('change', key, val, prev);\n\
  \t\tthis.emit('change ' + key, val, prev);\n\
  \t}\n\
  }, this);\n\
};\n\
\n\
\n\
/**\n\
 * Loop through store data.\n\
 * @param  {Function} cb   \n\
 * @param  {[type]}   scope \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.loop = function(cb, scope) {\n\
  utils.each(this.data, cb, scope || this);\n\
};\n\
\n\
\n\
/**\n\
 * Synchronize with local storage.\n\
 * \n\
 * @param  {String} name \n\
 * @param  {Boolean} bool save in localstore\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.local = function(name, bool) {\n\
  if(!bool) {\n\
    storage.setItem(name, this.toJSON());\n\
  } else {\n\
    this.reset(JSON.parse(storage.getItem(name)));\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Use middlewares to extend store.\n\
 * A middleware is a function with the store\n\
 * as first argument.\n\
 * \n\
 * @param  {Function} fn \n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.use = function(fn) {\n\
  fn(this);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Stringify model\n\
 * @return {String} json\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.toJSON = function() {\n\
  return JSON.stringify(this.data);\n\
};//@ sourceURL=bredele-maple/store.js"
));
require.register("bredele-maple/emitter.js", Function("exports, require, module",
"\n\
/**\n\
 * Dependencies.\n\
 */\n\
\n\
var utils = require('./lib/utils');\n\
//NOTES: should we move utils to the root?\n\
\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
\tif (obj) {\n\
\t\tobj.listeners = {}; //avoid listeners init in each handler\n\
\t\treturn utils.mixin(Emitter.prototype, obj);\n\
\t}\n\
  this.listeners = {};\n\
}\n\
\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on = function(event, fn, scope){\n\
\t(this.listeners[event] = this.listeners[event] || []).push([fn, scope]);\n\
\treturn this;\n\
};\n\
\n\
\n\
/**\n\
 * Listen an `event` listener that will be executed a single\n\
 * time.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn, scope){\n\
\tvar on = function() {\n\
\t\tfn.apply(scope, arguments);\n\
\t\tthis.off(event, on);\n\
\t};\n\
\tthis.on(event, on, this);\n\
};\n\
\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off = function(event, fn){\n\
\tif(arguments.length === 0) this.listeners = {};\n\
\tif(!fn) {\n\
\t\tdelete this.listeners[event];\n\
\t} else {\n\
\t\tvar listeners = this.listeners[event];\n\
\t\tfor(var l = listeners.length; l--;) {\n\
\t\t\tif(listeners[l][0] === fn) listeners.splice(l,1);\n\
\t\t}\n\
\t}\n\
\n\
\n\
};\n\
\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
\tvar listeners = this.listeners[event];\n\
\tif(!listeners) return;\n\
\tfor(var i = 0, l = listeners.length; i < l; i++) {\n\
\t\tvar listener = listeners[i];\n\
\t\tlistener[0].apply(listener[1] || this, utils.toArray(arguments, 1));\n\
\t}\n\
};\n\
//@ sourceURL=bredele-maple/emitter.js"
));
require.register("bredele-maple/binding.js", Function("exports, require, module",
"var Store = require('./store'),\n\
    trim = require('./lib/utils').trim,\n\
    subs = require('./lib/subs');\n\
\n\
/**\n\
 * Expose 'Binding'\n\
 */\n\
\n\
module.exports = Binding;\n\
\n\
\n\
/**\n\
 * Binding constructor.\n\
 * @api public\n\
 */\n\
\n\
function Binding(model) {\n\
\tif(!(this instanceof Binding)) return new Binding(model);\n\
\tthis.model = new Store(model);\n\
\tthis.plugins = {};\n\
}\n\
\n\
//todo: make better parser and more efficient\n\
function parser(str) {\n\
    //str = str.replace(/ /g,'');\n\
    var phrases = str ? str.split(';') : ['main'];\n\
    var results = [];\n\
    for(var i = 0, l = phrases.length; i < l; i++) {\n\
      var expr = phrases[i].split(':');\n\
\n\
      var params = [];\n\
      var name = expr[0];\n\
\n\
      if(expr[1]) {\n\
        var args = expr[1].split(',');\n\
        for(var j = 0, h = args.length; j < h; j++) {\n\
          params.push(trim(args[j]));\n\
        }\n\
      } else {\n\
        name = 'main'; //doesn't do anything\n\
      }\n\
\n\
      results.push({\n\
        method: trim(expr[0]),\n\
        params: params\n\
      });\n\
    }\n\
    return results;\n\
  }\n\
\n\
/**\n\
 * Bind object as function.\n\
 * @api private\n\
 */\n\
\n\
function binder(obj) {\n\
  return function(el, expr) {\n\
    var formats = parser(expr);\n\
    for(var i = 0, l = formats.length; i < l; i++) {\n\
      var format = formats[i];\n\
      format.params.splice(0, 0, el);\n\
      obj[format.method].apply(obj, format.params);\n\
    }\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * Add binding by name\n\
 * @param {String} name  \n\
 * @param {Object} plugin \n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.add = function(name, plugin) {\n\
  if(typeof plugin === 'object') plugin = binder(plugin);\n\
  this.plugins[name] = plugin;\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Attribute binding.\n\
 * @param  {HTMLElement} node \n\
 * @api private\n\
 */\n\
\n\
Binding.prototype.bindAttrs = function(node) {\n\
  var attrs = node.attributes;\n\
  for(var i = 0, l = attrs.length; i < l; i++) {\n\
    var attr = attrs[i],\n\
        plugin = this.plugins[attr.nodeName];\n\
\n\
    if(plugin) {\n\
      plugin.call(this.model, node, attr.nodeValue);\n\
    } else {\n\
      subs(attr, this.model);\n\
    }\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Apply bindings on a single node\n\
 * @param  {DomElement} node \n\
 * @api private\n\
 */\n\
\n\
Binding.prototype.bind = function(node) {\n\
  var type = node.nodeType;\n\
  //dom element\n\
  if (type === 1) return this.bindAttrs(node);\n\
  // text node\n\
  if (type === 3) subs(node, this.model);\n\
};\n\
\n\
\n\
/**\n\
 * Apply bindings on nested DOM element.\n\
 * @param  {DomElement} node \n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.apply = function(node) {\n\
  var nodes = node.childNodes;\n\
  this.bind(node);\n\
  for (var i = 0, l = nodes.length; i < l; i++) {\n\
    this.apply(nodes[i]);\n\
  }\n\
};//@ sourceURL=bredele-maple/binding.js"
));
require.register("bredele-maple/lib/app.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies\n\
 */\n\
\n\
var array = require('./utils').toArray,\n\
    Store = require('../store'),\n\
    Emitter = require('../emitter');\n\
\n\
\n\
//global maple emitter\n\
\n\
var emitter = new Emitter();\n\
\n\
\n\
/**\n\
 * Expose 'App'\n\
 */\n\
\n\
module.exports = App;\n\
\n\
\n\
/**\n\
 * Application prototype\n\
 */\n\
\n\
function App(name) {\n\
        //TODO: see if we should pass constructor parameters\n\
        this.name = name || \"\";\n\
        this.sandbox = new Store();\n\
}\n\
\n\
\n\
/**\n\
 * Listen events on communication bus.\n\
 *\n\
 * Example:\n\
 *\n\
 *     app.on('auth/login', fn);\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn \n\
 * @return {app} \n\
 */\n\
\n\
App.prototype.on = function(){\n\
        return emitter.on.apply(emitter, arguments);\n\
};\n\
\n\
\n\
/**\n\
 * Emit event on communication bus.\n\
 * \n\
 * Example:\n\
 *\n\
 *     app.emit('login', true);\n\
 *\n\
 * @param {String} name\n\
 * @return {app}\n\
 */\n\
\n\
App.prototype.emit = function(name) {\n\
        var args = [this.name + '/' + name].concat(array(arguments, 1));\n\
        return emitter.emit.apply(emitter, args);\n\
};\n\
\n\
\n\
/**\n\
 * Listen events once on communication bus.\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn \n\
 * @return {app} \n\
 */\n\
\n\
App.prototype.once = function() {\n\
        return emitter.once.apply(emitter, arguments);\n\
};\n\
\n\
\n\
/**\n\
 * Remove event listener on communication bus.\n\
 *\n\
 * Example:\n\
 *\n\
 *     app.off('auth/login', fn);\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn \n\
 * @return {app} \n\
 */\n\
\n\
App.prototype.off = function() {\n\
        return emitter.off.apply(emitter, arguments);\n\
};\n\
\n\
\n\
/**\n\
 * Init handler.\n\
 * \n\
 * Example:\n\
 *\n\
 *     app.init(); //emit init event\n\
 *     app.init(fn); //register init callback\n\
 *     \n\
 * @param  {Function} fn \n\
 * @api public\n\
 */\n\
\n\
App.prototype.init = function(fn) {\n\
        //TODO: should we have scope?\n\
        if(fn) return this.sandbox.on('init', fn);\n\
        this.sandbox.emit('init');\n\
};\n\
\n\
\n\
/**\n\
 * Proxy to intialize other quick apps.\n\
 *\n\
 * @param {String} name\n\
 * @param {Function|App} fn \n\
 * @return {app} for chaning api\n\
 * @api public\n\
 */\n\
\n\
App.prototype.use = function(name, fn) {\n\
        //function middleware\n\
        if(typeof name === 'function') {\n\
                name.call(null, this);\n\
        }\n\
        \n\
        //artery app\n\
        if(fn && fn.use) { //what defined an app?\n\
                fn.name = name; //TODO: should we test that name is a string?\n\
                fn.sandbox.emit('init'); //TODO: should we do once?\n\
                this.sandbox.emit('init ' + fn.name); //we could use %s\n\
        }\n\
};\n\
\n\
\n\
/**\n\
 * Configuration handler (setter/getter).\n\
 *\n\
 * Example:\n\
 *\n\
 *     app.config(); //return config data\n\
 *     app.config({type:'app'}); //set config data\n\
 *     app.config('type', 'worker'); //set config prop\n\
 *     app.config('type'); //get config prop\n\
 *     \n\
 * @api public\n\
 */\n\
\n\
App.prototype.config = function(key, value) {\n\
        //we could save the config in localstore\n\
        if(!key) return this.sandbox.data;\n\
        if(typeof key === 'object') {\n\
                this.sandbox.reset(key);\n\
                return;\n\
        }\n\
        if(!value) return this.sandbox.get(key);\n\
        this.sandbox.set(key, value);\n\
};\n\
\n\
\n\
// App.prototype.worker = function() {\n\
//         //initialize an app inside a web worker\n\
// };\n\
\n\
\n\
App.prototype.debug = function() {\n\
        //common debug bus\n\
};//@ sourceURL=bredele-maple/lib/app.js"
));
require.register("bredele-maple/lib/supplant.js", Function("exports, require, module",
"var utils = require('./utils');\n\
\n\
\n\
/**\n\
 * Variable substitution on the string.\n\
 *\n\
 * @param {String} str\n\
 * @param {Object} model\n\
 * @return {String} interpolation's result\n\
 */\n\
\n\
module.exports = function(text, model){\n\
  return text.replace(/\\{([^}]+)\\}/g, function(_, expr) {\n\
    return model[utils.trim(expr)] || '';\n\
  });\n\
};\n\
\n\
/**\n\
 * Substitutions attributes.\n\
 * \n\
 * @param  {String} text \n\
 * @return {Array}\n\
 */\n\
module.exports.attrs = function(text) {\n\
  var exprs = [];\n\
  text.replace(/\\{([^}]+)\\}/g, function(_, expr){\n\
    var val = utils.trim(expr);\n\
    if(!~utils.indexOf(exprs, val)) exprs.push(val);\n\
  });\n\
  return exprs;\n\
};//@ sourceURL=bredele-maple/lib/supplant.js"
));
require.register("bredele-maple/lib/subs.js", Function("exports, require, module",
"var supplant = require('./supplant'),\n\
    utils = require('./utils');\n\
\n\
\n\
/**\n\
 * Node text substitution constructor.\n\
 * @param {HTMLElement} node type 3\n\
 * @param {Store} store \n\
 */\n\
\n\
module.exports = function(node, store) {\n\
  var text = node.nodeValue;\n\
\n\
  if(!~ utils.indexOf(text, '{')) return;\n\
\n\
  var exprs = getProps(text),\n\
      handle = function() {\n\
        node.nodeValue = supplant(text, store.data);\n\
      };\n\
\n\
  for(var l = exprs.length; l--;) {\n\
    store.on('change ' + exprs[l], handle);\n\
  }\n\
\n\
  handle();\n\
};\n\
\n\
\n\
function getProps(text) {\n\
  var exprs = [];\n\
  \n\
  //is while and test faster?\n\
  text.replace(/\\{([^}]+)\\}/g, function(_, expr){\n\
    if(!~utils.indexOf(exprs, expr)) exprs.push(expr);\n\
  });\n\
\n\
  return exprs;\n\
}//@ sourceURL=bredele-maple/lib/subs.js"
));
require.register("bredele-maple/lib/utils.js", Function("exports, require, module",
"\n\
/**\n\
 * Mixin to objects.\n\
 * \n\
 * @param {Object} from\n\
 * @param {Object} to \n\
 * @return {Object} to\n\
 */\n\
\n\
module.exports.mixin = function(from, to) {\n\
\tfor (var key in from) {\n\
\t\tif (from.hasOwnProperty(key)) {\n\
\t\t\tto[key] = from[key];\n\
\t\t}\n\
\t}\n\
\treturn to;\n\
};\n\
\n\
\n\
/**\n\
 * toArray\n\
 *\n\
 * @param {Object}  obj Array-like or string\n\
 * @param {Number}  index slice index\n\
 * @return {Array} Empty Array if argument other than string or Object\n\
 * @api public\n\
 */\n\
\n\
module.exports.toArray = function(arg, idx) {\n\
\treturn [].slice.call(arg, idx);\n\
};\n\
\n\
\n\
/**\n\
 * Index of.\n\
 * @param {Array} arr\n\
 * @param {Object} obj \n\
 * @return {Number}\n\
 */\n\
\n\
module.exports.indexOf = function(arr, obj) {\n\
 \tif (arr.indexOf) return arr.indexOf(obj);\n\
 \tfor (var i = 0; i < arr.length; ++i) {\n\
 \t\tif (arr[i] === obj) return i;\n\
 \t}\n\
 \treturn -1;\n\
 };\n\
\n\
\n\
/**\n\
 * Trim string.\n\
 * @param {String} str \n\
 * @return {string} \n\
 */\n\
\n\
module.exports.trim = function(str){\n\
  if(str.trim) return str.trim();\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
};\n\
\n\
\n\
/**\n\
 * Object iteration.\n\
 * @param  {Object}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 */\n\
\n\
module.exports.each = function(obj, fn, scope) {\n\
\tif( obj instanceof Array) {\n\
\t\tfor(var i = 0, l = obj.length; i < l; i++){\n\
\t\t\tfn.call(scope, i, obj[i]);\n\
\t\t}\n\
\t} else if(typeof obj === 'object') {\n\
\t\tfor (var i in obj) {\n\
\t\t\tif (obj.hasOwnProperty(i)) {\n\
\t\t\t\tfn.call(scope, i, obj[i]);\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Clone object.\n\
 * \n\
 * @param  {Object} obj \n\
 * @api private\n\
 */\n\
\n\
module.exports.clone = function clone(obj) {\n\
\tif(obj instanceof Array) {\n\
\t\treturn obj.slice(0);\n\
\t}\n\
\tif(typeof obj === 'object') {\n\
\t\tvar copy = {};\n\
\t\tfor (var key in obj) {\n\
\t\t\tif (obj.hasOwnProperty(key)) {\n\
\t\t\t\tcopy[key] = clone(obj[key]);\n\
\t\t\t}\n\
\t\t}\n\
\t\treturn copy;\n\
\t}\n\
\treturn obj;\n\
};\n\
//@ sourceURL=bredele-maple/lib/utils.js"
));
require.register("bredele-event/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Polyfill\n\
 */\n\
\n\
 var attach = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
     detach = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
     prefix = attach !== 'addEventListener' ? 'on' : '';\n\
\n\
/**\n\
 * Matches query selection.\n\
 * \n\
 * @param  {HTMLElement} el \n\
 * @param  {HTMLElement} target  \n\
 * @param  {String} selector \n\
 * @return {Boolean}  true if the element would be selected by the \n\
 * specified selector string\n\
 */\n\
function matches(el, target, selector) {\n\
\t//refactor with maple (childnodes indexof)\n\
\treturn [].slice.call(el.querySelectorAll(selector)).indexOf(target) > -1;\n\
}\n\
\n\
\n\
/**\n\
 * Attach Event Listener.\n\
 * \n\
 * @param  {HTMLElement}   el\n\
 * @param  {String}   str\n\
 * @param  {Function} fn \n\
 * @param  {Boolean}   capture\n\
 * @return {Array} handler to detach event      \n\
 */\n\
\n\
 exports.attach = function(el, str, fn, capture) {\n\
 \tvar filter = str.split('>'),\n\
 \t    phrase = filter[0].split(' '),\n\
 \t    topic = phrase.shift(),\n\
 \t    selector = phrase.join(' ');\n\
\n\
  //TODO: do that globally?\n\
 \tvar cb = function(ev) {\n\
 \t\tvar target = ev.target || ev.srcElement;\n\
 \t\tif(!selector || matches(el, target, selector)) {\n\
 \t\t\tvar code = filter[1] && filter[1].replace(/ /g,'');\n\
 \t\t\tif(!code || ev.keyCode.toString() === code) fn(target, ev);\n\
 \t\t}\n\
 \t};\n\
\n\
  el[attach](prefix + topic, cb, capture || false);\n\
 \treturn [topic, cb, capture];\n\
 };\n\
\n\
\n\
/**\n\
 * Detach event listener.\n\
 * \n\
 * @param  {HTMLElement}   el\n\
 * @param  {String}   str\n\
 * @param  {Function} fn\n\
 * @param  {Boolean}   capture   \n\
 */\n\
\n\
 exports.detach = function(el, str, fn, capture) {\n\
 \tel[detach](prefix + str, fn, capture || false);\n\
 };\n\
//@ sourceURL=bredele-event/index.js"
));
require.register("bredele-event-plugin/index.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var ev = require('event');\n\
\n\
/**\n\
 * Map touch events.\n\
 * @type {Object}\n\
 * @api private\n\
 */\n\
\n\
var mapper = {\n\
\t'click' : 'touchend',\n\
\t'mousedown' : 'touchstart',\n\
\t'mouseup' : 'touchend',\n\
\t'mousemove' : 'touchmove'\n\
};\n\
\n\
\n\
/**\n\
 * Expose 'Event plugin'\n\
 */\n\
\n\
module.exports = Events;\n\
\n\
\n\
/**\n\
 * Event plugin constructor\n\
 * @param {Object} view event plugin scope\n\
 * @param {Boolean} isTouch optional\n\
 * @api public\n\
 */\n\
\n\
function Events(view, isTouch){\n\
  this.view = view;\n\
  this.listeners = [];\n\
  this.isTouch = isTouch || (window.ontouchstart !== undefined);\n\
}\n\
\n\
\n\
\n\
/**\n\
 * Listen events.\n\
 * @param {HTMLElement} node \n\
 * @param {String} type event's type\n\
 * @param {String} fn view's callback name\n\
 * @param {String} capture useCapture\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.on = function(node, type, fn, capture) {\n\
  var _this = this,\n\
     cb = function(target, e) {\n\
      _this.view[fn].call(_this.view, e, node); //we should pass target\n\
     };\n\
  //todo: event should return the node as well...it's too complicated\n\
  this.listeners.push([node].concat(ev.attach(node, type, cb, (capture === 'true'))));\n\
};\n\
\n\
\n\
\n\
/**\n\
 * Map events (desktop and mobile)\n\
 * @param  {String} type event's name\n\
 * @return {String} mapped event\n\
 */\n\
\n\
Events.prototype.map = function(type) {\n\
\treturn this.isTouch ? (mapper[type] || type) : type;\n\
};\n\
\n\
\n\
/**\n\
 * Remove all listeners.\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.destroy = function() {\n\
  for(var l = this.listeners.length; l--;) {\n\
    var listener = this.listeners[l];\n\
    ev.detach(listener[0], listener[1], listener[2], listener[3]);\n\
  }\n\
  this.listeners = [];\n\
};\n\
\n\
//@ sourceURL=bredele-event-plugin/index.js"
));
require.register("showcase/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var View = require('maple/view'),\n\
    event = require('event'), //do with plugin\n\
    Plugin = require('event-plugin'),\n\
    html = require('./showcase.html');\n\
\n\
var fragment = document.createDocumentFragment(); //may be have a hide function\n\
\n\
//init\n\
var view = new View(); //do factory for view\n\
view.html(html);\n\
view.attr('event', new Plugin({\n\
\tclose: function() {\n\
\t\tfragment.appendChild(view.dom); //use insert instead\n\
\t}\n\
}));\n\
view.insert(fragment);\n\
\n\
//do view for click\n\
event.attach(document.querySelector('.btn'), 'click', function() {\n\
\tview.insert(document.body);\n\
});//@ sourceURL=showcase/index.js"
));








require.register("showcase/showcase.html", Function("exports, require, module",
"module.exports = '<div class=\"showcase\">\\n\
\t<header class=\"toolbar\">\\n\
\t\t<div class=\"left icon-list toolbar-btn\"></div>\\n\
\t\t<div class=\"right icon-cross toolbar-btn\" event=\"on:click,close\"></div>\\n\
\t</header>\\n\
\t<section></section>\\n\
</div>';//@ sourceURL=showcase/showcase.html"
));

require.alias("showcase/index.js", "maple/deps/showcase/index.js");
require.alias("showcase/index.js", "maple/deps/showcase/index.js");
require.alias("showcase/index.js", "showcase/index.js");
require.alias("bredele-maple/maple.js", "showcase/deps/maple/maple.js");
require.alias("bredele-maple/view.js", "showcase/deps/maple/view.js");
require.alias("bredele-maple/store.js", "showcase/deps/maple/store.js");
require.alias("bredele-maple/emitter.js", "showcase/deps/maple/emitter.js");
require.alias("bredele-maple/binding.js", "showcase/deps/maple/binding.js");
require.alias("bredele-maple/lib/app.js", "showcase/deps/maple/lib/app.js");
require.alias("bredele-maple/lib/supplant.js", "showcase/deps/maple/lib/supplant.js");
require.alias("bredele-maple/lib/subs.js", "showcase/deps/maple/lib/subs.js");
require.alias("bredele-maple/lib/utils.js", "showcase/deps/maple/lib/utils.js");
require.alias("bredele-maple/maple.js", "showcase/deps/maple/index.js");
require.alias("bredele-maple/maple.js", "bredele-maple/index.js");
require.alias("bredele-event/index.js", "showcase/deps/event/index.js");
require.alias("bredele-event/index.js", "showcase/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-event-plugin/index.js", "showcase/deps/event-plugin/index.js");
require.alias("bredele-event-plugin/index.js", "showcase/deps/event-plugin/index.js");
require.alias("bredele-event/index.js", "bredele-event-plugin/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-event-plugin/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-event-plugin/index.js", "bredele-event-plugin/index.js");
require.alias("showcase/index.js", "showcase/index.js");