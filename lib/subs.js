var supplant = require('./supplant'),
    utils = require('./utils');


/**
 * Node text substitution constructor.
 * @param {HTMLElement} node type 3
 * @param {Store} store 
 */

module.exports = function(node, store) {
  var text = node.nodeValue;

  if(!~ utils.indexOf(text, '{')) return;

  var exprs = getProps(text),
      handle = function() {
        node.nodeValue = supplant(text, store.data);
      };

  for(var l = exprs.length; l--;) {
    store.on('change ' + exprs[l], handle);
  }

  handle();
};


function getProps(text) {
  var exprs = [];
  
  //is while and test faster?
  text.replace(/\{([^}]+)\}/g, function(_, expr){
    if(!~utils.indexOf(exprs, expr)) exprs.push(expr);
  });

  return exprs;
}