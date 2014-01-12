var supplant = require('supplant'),
    indexOf = require('indexof'),
    props = require('supplant/lib/props');


/**
 * Node text substitution constructor.
 * @param {HTMLElement} node type 3
 * @param {Store} store 
 */

module.exports = function(node, store) {
  var text = node.nodeValue;

  //TODO: it seems faster if index in index.js??
  //is it enought to say that's an interpolation?
  if(!~ indexOf(text, '{')) return;

  var exprs = getProps(text),
      handle = function() {
        node.nodeValue = supplant(text, store.data);
      };

  for(var l = exprs.length; l--;) {
    //when destroy binding, we should do off store
    store.on('change ' + exprs[l], handle);
  }

  handle();
};


function getProps(text) {
  var exprs = [];
  
  //is while and test faster?
  text.replace(/\{([^}]+)\}/g, function(_, expr){
    if(!~indexOf(exprs, expr)) exprs = exprs.concat(props(expr));
  });

  return exprs;
}