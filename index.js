/**
 * Dependencies
 */

var store = require('datastore').factory
var walk = require('domwalk')
var bind = require('./lib/bind')


/**
 * Create a Legoh brick.
 * A brick is a DOM element that updates itself with data changes.
 *
 * @param {String | Element} tmpl
 * @param {Object} data
 * @api public
 */

module.exports = function(tmpl, data) {

  data = data || {}

  var el = domify(tmpl)

  var brick = store(function() {
    return el
  }, data)

  walk(el, function(node) {
    if(node.nodeType == 1) {
      // @note attributes and node type should be handled by bind
      attribute(brick, node, data)
    } else bind(brick, node, data)
  })

  return brick
}

function attribute(brick, node, data) {
  var attrs = node.attributes
  for(var i = 0, l = attrs.length; i < l; i++) {
    var attr = attrs[i]
    //text(brick, attr, data)
    var name = attr.nodeName
    if(name.substring(0,2) == 'on') {
      var content = attr.nodeValue
      attr.nodeValue = ''
      listen(brick, node, name.substring(2), content)
    }
  }
}


/**
 * Delegate DOM event to the datastore emitter.
 *
 * @note we should also register the listener handler
 * to a removed event (with mutation observer).
 *
 * @param {Datastore} brick
 * @param {Element} node
 * @param {String} type
 * @param {String} topic
 * @api private
 */

function listen(brick, node, type, topic) {
  node.addEventListener(type, function(event) {
    brick.emit(type + (topic ? ' ' + topic : ''))
  })
}

/**
 * Transform template into a DOM element.
 *
 * @param {String | Element} tmpl
 * @return {Element}
 * @api private
 */

function domify(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  return div.children[0]
}
