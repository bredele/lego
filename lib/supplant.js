var utils = require('./utils');



/**
 * Variable substitution on the string.
 *
 * @param {String} str
 * @param {Object} model
 * @return {String} interpolation's result
 */

 module.exports = function(text, model){
  return text.replace(/\{([^}]+)\}/g, function(_, expr) {
    return model[utils.trim(expr)] || '';
  });
};


module.exports.attrs = function(text) {
  var exprs = [];
  text.replace(/\{([^}]+)\}/g, function(_, expr){
    var val = trim(expr);
    if(!~utils.indexOf(exprs, val)) exprs.push(val);
  });
  return exprs;
};