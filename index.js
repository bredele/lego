/**
 * Dependencies
 */

var store = require('datastore')


/**
 *
 */

module.exports = function(tmpl, target) {
  target = target || {}
  var brick = store(target.data)
  brick.el = domify(tmpl)
  return brick
}


function domify(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  return div.children[0]
}
