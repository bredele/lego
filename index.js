

/**
 * Expose 'brick'
 */

module.exports = function(tmpl) {
  return new Brick(tmpl)
}


/**
 * Brick constructor.
 *
 * Examples:
 *
 *   var lego = brick('<button>');
 *   var lego = brick('<button>', data);
 *
 * @param {String | Element?} tmpl
 * @param {Object?} data
 * @api public
 */

function Brick(tmpl) {
  this.el = element(tmpl)
}



/**
 * Create Element.
 *
 * 
 * @param  {Element|String} tmpl 
 * @return {Element}
 * @api private      
 */

function element(tmpl) {
  if(typeof tmpl === 'string') {
    if(tmpl.indexOf('<') > -1 ) {
      var div = document.createElement('div')
      div.innerHTML = tmpl
      tmpl = div.children[0]
    } else tmpl = document.querySelector(tmpl)
  }
  return tmpl
}