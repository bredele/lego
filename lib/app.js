
/**
 * Module dependencies
 */

var array = require('./utils').toArray,
    Store = require('../store'),
    Emitter = require('../emitter');


//global maple emitter

var emitter = new Emitter();


/**
 * Expose 'App'
 */

module.exports = App;


/**
 * Application prototype
 */

function App(name) {
        //TODO: see if we should pass constructor parameters
        this.name = name || "";
        this.sandbox = new Store();
}


/**
 * Listen events on communication bus.
 *
 * Example:
 *
 *     app.on('auth/login', fn);
 *
 * @param {String} name
 * @param {Function} fn 
 * @return {app} 
 */

App.prototype.on = function(){
        return emitter.on.apply(emitter, arguments);
};


/**
 * Emit event on communication bus.
 * 
 * Example:
 *
 *     app.emit('login', true);
 *
 * @param {String} name
 * @return {app}
 */

App.prototype.emit = function(name) {
        var args = [this.name + '/' + name].concat(array(arguments, 1));
        return emitter.emit.apply(emitter, args);
};


/**
 * Listen events once on communication bus.
 *
 * @param {String} name
 * @param {Function} fn 
 * @return {app} 
 */

App.prototype.once = function() {
        return emitter.once.apply(emitter, arguments);
};


/**
 * Remove event listener on communication bus.
 *
 * Example:
 *
 *     app.off('auth/login', fn);
 *
 * @param {String} name
 * @param {Function} fn 
 * @return {app} 
 */

App.prototype.off = function() {
        return emitter.off.apply(emitter, arguments);
};


/**
 * Init handler.
 * 
 * Example:
 *
 *     app.init(); //emit init event
 *     app.init(fn); //register init callback
 *     
 * @param  {Function} fn 
 * @api public
 */

App.prototype.init = function(fn) {
        //TODO: should we have scope?
        if(fn) return this.sandbox.on('init', fn);
        this.sandbox.emit('init');
};


/**
 * Proxy to intialize other quick apps.
 *
 * @param {String} name
 * @param {Function|App} fn 
 * @return {app} for chaning api
 * @api public
 */

App.prototype.use = function(name, fn) {
        //function middleware
        if(typeof name === 'function') {
                name.call(null, this);
        }
        
        //artery app
        if(fn && fn.use) { //what defined an app?
                fn.name = name; //TODO: should we test that name is a string?
                fn.sandbox.emit('init'); //TODO: should we do once?
                this.sandbox.emit('init ' + fn.name); //we could use %s
        }
};


/**
 * Configuration handler (setter/getter).
 *
 * Example:
 *
 *     app.config(); //return config data
 *     app.config({type:'app'}); //set config data
 *     app.config('type', 'worker'); //set config prop
 *     app.config('type'); //get config prop
 *     
 * @api public
 */

App.prototype.config = function(key, value) {
        //we could save the config in localstore
        if(!key) return this.sandbox.data;
        if(typeof key === 'object') {
                this.sandbox.reset(key);
                return;
        }
        if(!value) return this.sandbox.get(key);
        this.sandbox.set(key, value);
};


// App.prototype.worker = function() {
//         //initialize an app inside a web worker
// };


App.prototype.debug = function() {
        //common debug bus
};