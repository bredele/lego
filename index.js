/**
 * Dependencies
 */

var store = require('datastore')
var walk = require('domwalk')


/**
 *
 */

module.exports = function(tmpl, target) {
  target = target || {}

  var brick = store(target.data)

  brick.el = domify(tmpl)

  walk(brick.el, function(node) {
    if(node.nodeType == 1) {
      var attrs = node.attributes
      for(var i = 0, l = attrs.length; i < l; i++) {
        var attr = attrs[i]
        var name = attr.nodeName
        if(name.substring(0,2) == 'on') {
          var topic = name.substring(2)
          var content = attr.nodeValue
          attr.nodeValue = ''
          listen(brick, node, topic, content)
        }
      }
    }
  })

  return brick
}



function listen(brick, node, type, topic) {
  node.addEventListener(type, function(event) {
    brick.emit(type + (topic ? ' ' + topic : ''))
  })
}


function domify(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  return div.children[0]
}
