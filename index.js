

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
  this.tmpl(tmpl)
}


/**
 * Create brick element.
 *
 * 
 * @param  {Element|String} tmpl 
 * @return {Element}
 * @api public      
 */

Brick.prototype.tmpl = function(str) {
  if(typeof str === 'string') {
    if(str.indexOf('<') > -1 ) {
      var div = document.createElement('div')
      div.innerHTML = str
      str = div.children[0]
    } else str = document.querySelector(str)
  }
  this.el = str
  return this
};
