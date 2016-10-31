/**
 * Dependencies
 */

var store = require('datastore').factory
var walk = require('domwalk')
var bind = require('./lib/bind')

/**
 *
 */

module.exports = function(tmpl, target) {

  target = target || {}

  var el = domify(tmpl)

  var data = target.data || {}

  var brick = store(function() {
    return el
  }, data)

  walk(el, function(node) {
    if(node.nodeType == 1) attribute(brick, node, data)
    else bind(brick, node, data)
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


function listen(brick, node, type, topic) {
  node.addEventListener(type, function(event) {
    brick.emit(type + (topic ? ' ' + topic : ''))
  })
  //brick.on('removed',)
}


function domify(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  return div.children[0]
}
