var supplant = require('./supplant'),
    utils = require('./utils');

// function supplant(text, model) {
//   var exprs = [],
//       value = text.replace(/\{([^}]+)\}/g, function(_, expr) {
//         var val = utils.trim(expr);
//         if(!~utils.indexOf(exprs, val)) exprs.push(val);
//         return model[val] || '';
//       });
//   return {
//     text: value,
//     exprs: exprs
//   };
// }

/**
 * Node text substitution constructor.
 * @param {HTMLElement} node type 3
 * @param {Store} store 
 */

module.exports = function(node, store) {
  var text = node.nodeValue;
  if(!~ utils.indexOf(text, '{')) return;

  var exprs = supplant.attrs(text),
      handle = function() {
        //should we cache a function?
        node.nodeValue = supplant(text, store.data);
      };

  for(var l = exprs.length; l--;) {
    store.on('change ' + exprs[l], handle);
  }
  
  //may be move handle before the loop
  handle();
};
