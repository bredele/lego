var supplant = require('./supplant'),
    utils = require('./utils');

/**
 * Node text substitution constructor.
 * @param {HTMLElement} node type 3
 * @param {Store} store 
 */

module.exports = function(node, store) {
  var text = node.nodeValue,
      listeners = [];
  if(!~ utils.indexOf(text, '{')) return;

  var exprs = supplant.attrs(text),
      handle = function() {
        //should we cache a function?
        node.nodeValue = supplant(text, store.data);
      };


  //may be move handle before the loop
  handle();

  for(var l = exprs.length; l--;) {
    var ev = 'change ' + exprs[l];
    store.on('change ' + exprs[l], handle);
    listeners.push(ev, handle); //emitter should return listener
  }
  return listeners;
};
